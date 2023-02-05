from django.contrib.auth import logout, login, authenticate
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from webapp.serializers import UserSerializer
from webapp.utils.permissions import IsAuthenticatedNotPost
from .providers.provider import Provider
from .serializers import UserSignInSerializer
from ..apps import logger
from ..models import User
from ..settings import webapp_settings

# OAuh2 Providers
providers: dict[str, Provider] = {}

if webapp_settings.is_provider_enabled('github'):
    from .providers.github_provider import GithubProvider

    providers["github"] = GithubProvider()
    pass
if webapp_settings.is_provider_enabled('discord'):
    from .providers.discord_provider import DiscordProvider

    providers["discord"] = DiscordProvider()


@permission_classes([IsAuthenticatedNotPost])
class UserView(APIView):
    def get(self, request):
        user = request.user
        serialized_user = UserSerializer(user)
        return Response({"details": "User object", "user": serialized_user.data})

    def delete(self, request):
        logout(request)
        return Response({"details": "Logout successful"})

    def post(self, request):
        """
        This function logs in the user and returns
        and HttpOnly cookie, the `sessionid` cookie
        """
        serializer = UserSignInSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = authenticate(
            username=data['username'], password=data['password'])
        if user is not None:
            login(request, user)
            serialized_user = UserSerializer(user)
            return Response({"detail": "Success", "user": serialized_user.data})
        return Response({"detail": "Invalid credentials"}, status=400)


@ensure_csrf_cookie
@api_view(['GET'])
def signin_set_cookie(_):
    """
    `signin_set_cookie` requires that a csrf cookie be set.
    `getCsrfToken` in `auth.js` uses this cookie to
    make a request to `login_view`
    """
    return Response({"detail": "CSRF cookie set"})


@api_view(['GET'])
def check_user(self: Request) -> Response:
    """
    Checks if the user exists
    """
    username = self.query_params.get('username')
    user = User.objects.filter(username__iexact=username).first()

    if user is None:
        return Response({"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"detail": "User exists"})


class OAuth2View(APIView):
    def get(self, request):
        """
        Redirects to the OAuth2 signin page
        """
        provider = request.query_params.get('provider')
        if provider and webapp_settings.is_provider_enabled(provider):
            authorization_url, state = providers[provider].authorize()
            request.session['oauth_state'] = state

            return Response({
                "detail": "Redirect OAuth2 url",
                "url": authorization_url
            })

        return Response({"detail": "Unknown auth provider"}, status=400)

    def post(self, request: Request) -> Response:
        """
        Signin the user from the OAuth2 information
        """
        provider = request.query_params.get('provider')
        if provider and webapp_settings.is_provider_enabled(provider):
            param_state = request.query_params.get('state')
            session_state = request.session.get('oauth_state')

            if param_state != session_state:
                return Response({"detail": "Invalid state"}, status=400)

            url = request.get_full_path()

            try:
                providers[provider].token(url)
                provided_user = providers[provider].get_user()

                provided_user.is_valid()

                user_auth = provided_user.to_database_user()

                if not user_auth:
                    return Response({
                        "detail": "User doesn't exists",
                        "oauth2_user": provided_user.data
                    }, status=404)

                login(request, user_auth.user)
                serialized_user = UserSerializer(user_auth.user)
                return Response({"detail": "Success", "user": serialized_user.data})

            except Exception as e:
                logger.exception("Failed to authenticate user", e)
                return Response({
                    "detail": "Failed to authenticate user. If the problem persists, contact the administrator"
                }, status=500)

        return Response({"detail": "Unknown auth provider"}, status=400)
