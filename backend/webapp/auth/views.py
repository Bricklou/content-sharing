import logging

from django.contrib.auth import logout, login, authenticate
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from webapp.serializers import UserSerializer
from webapp.utils.permissions import IsAuthenticatedNotPost
from .serializers import UserLoginSerializer

logger = logging.getLogger("django")
logger.setLevel(logging.INFO)


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
    return Response({"details": "CSRF cookie set"})
