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
from .serializers import UserLoginSerializer
from ..apps import logger
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
        serializer = UserLoginSerializer(data=request.data)
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
def login_set_cookie(_):
    """
    `login_view` requires that a csrf cookie be set.
    `getCsrfToken` in `auth.js` uses this cookie to
    make a request to `login_view`
    """
    return Response({"detail": "CSRF cookie set"})


class OAuth2View(APIView):
    def get(self, request):
        """
        Redirects to the OAuth2 login page
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
        Login the user from the OAuth2 information
        """
        provider = request.query_params.get('provider')
        if provider and webapp_settings.is_provider_enabled(provider):
            param_state = request.query_params.get('state')
            session_state = request.session.get('oauth_state')

            if param_state != session_state:
                return Response({"detail": "Invalid state"}, status=400)

            url = request.get_full_path()

            try:
                token = providers[provider].token(url)
                user = providers[provider].get_user()

                if not user:
                    raise Exception("Invalid user")

                login(request, user)
                serialized_user = UserSerializer(user)
                return Response({"detail": "Success", "user": serialized_user.data})

            except Exception as e:
                logger.error(f'Failed to authenticate user: {e}')
                return Response({
                    "detail": "Failed to authenticate user. If the problem persists, contact the administrator"
                }, status=400)

        return Response({"detail": "Unknown auth provider"}, status=400)
