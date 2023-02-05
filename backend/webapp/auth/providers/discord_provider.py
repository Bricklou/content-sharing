from requests_oauthlib import OAuth2Session

from webapp.auth.providers.provider import Provider
from webapp.auth.serializers import ProvidedUserSerializer
from webapp.models.user_auth import UserAuth
from webapp.settings import webapp_settings


class DiscordProvider(Provider):
    _BASE_AUTHORIZATION_URL = "https://discord.com/api/oauth2/authorize"
    _TOKEN_URL = "https://discord.com/api/oauth2/token"
    _USER_URL = "https://discord.com/api/users/@me"

    __session: OAuth2Session

    def __init__(self):
        self.__session = OAuth2Session(
            client_id=webapp_settings.auth["discord"]["client_id"],
            redirect_uri=webapp_settings.auth["discord"]["redirect_uri"],
            scope="identify email",
        )

    def authorize(self) -> tuple[str, str]:
        authorization_url, state = self.__session.authorization_url(
            self._BASE_AUTHORIZATION_URL,
            prompt="consent",
        )
        return authorization_url, state

    def token(self, response: str):
        token = self.__session.fetch_token(
            self._TOKEN_URL,
            authorization_response=response,
            client_secret=webapp_settings.auth["discord"]["client_secret"]
        )
        return token

    def get_user(self) -> ProvidedUserSerializer:
        json_user_data = self.__session.get(self._USER_URL).json()
        user = ProvidedUserSerializer(data={
            'id': json_user_data['id'],
            'username': json_user_data['username'],
            'email': json_user_data['email'],
            'avatar': f'https://cdn.discordapp.com/avatars/{json_user_data["id"]}/{json_user_data["avatar"]}.png',
            'provider': UserAuth.AuthProvider.DISCORD,
        })

        return user
