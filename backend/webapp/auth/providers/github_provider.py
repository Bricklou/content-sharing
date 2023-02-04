from requests_oauthlib import OAuth2Session

from webapp.auth.providers.provider import Provider
from webapp.models import User
from webapp.models.user_auth import UserAuth
from webapp.settings import webapp_settings


class GithubProvider(Provider):
    _BASE_AUTHORIZATION_URL = "https://github.com/login/oauth/authorize"
    _TOKEN_URL = "https://github.com/login/oauth/access_token"
    _USER_URL = "https://api.github.com/user"

    __session: OAuth2Session

    def __init__(self):
        self.__session = OAuth2Session(
            client_id=webapp_settings.auth["github"]["client_id"],
            redirect_uri=webapp_settings.auth["github"]["redirect_uri"],
            scope="read:user,user:email",
        )

    def authorize(self) -> tuple[str, str]:
        authorization_url, state = self.__session.authorization_url(
            self._BASE_AUTHORIZATION_URL,
            prompt="login",
        )
        return authorization_url, state

    def token(self, response: str):
        token = self.__session.fetch_token(
            self._TOKEN_URL,
            authorization_response=response,
            client_secret=webapp_settings.auth["github"]["client_secret"]
        )
        return token

    def get_user(self) -> User | None:
        json_user_data = self.__session.get(self._USER_URL).json()

        provided_user = UserAuth.objects.filter(
            remote_user_id=json_user_data['id'],
            remote_user_email=json_user_data['email'],
            provider=UserAuth.AuthProvider.GITHUB,
        ).first()

        if not provided_user:
            return None

        return provided_user.user