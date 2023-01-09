import logging

from django.contrib.auth import logout, authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView

from webapp.serializers import UserSerializer
from webapp.utils.permissions import IsAuthenticatedNotPost

logger = logging.getLogger("django")
logger.setLevel(logging.INFO)


@permission_classes([IsAuthenticatedNotPost])
class UserView(APIView):
    def get(self, request):
        user = request.user
        serialized_user = UserSerializer(user)
        return JsonResponse({"details": "User object", "user": serialized_user.data})

    def delete(self, request):
        logout(request)
        return JsonResponse({"details": "Logout successful"})

    def post(self, request):
        """
            This function logs in the user and returns
            and HttpOnly cookie, the `sessionid` cookie
            """
        data = request.data
        print(data)
        username = data.get("username")
        password = data.get("password")
        if username is None or password is None:
            return JsonResponse(
                {"errors": {"__all__": "Please enter both username and password"}},
                status=400,
            )
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            serialized_user = UserSerializer(user)
            return JsonResponse({"detail": "Success", "user": serialized_user.data})
        return JsonResponse({"detail": "Invalid credentials"}, status=400)


@ensure_csrf_cookie
def login_set_cookie(request):
    """
    `login_view` requires that a csrf cookie be set.
    `getCsrfToken` in `auth.js` uses this cookie to
    make a request to `login_view`
    """
    return JsonResponse({"details": "CSRF cookie set"})
