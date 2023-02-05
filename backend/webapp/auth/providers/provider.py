from webapp.auth.serializers import ProvidedUserSerializer


class Provider:
    """
    Abstract class for OAuth2 provider.
    """

    def authorize(self):
        raise NotImplementedError

    def token(self, response: str):
        raise NotImplementedError

    def get_user(self) -> ProvidedUserSerializer:
        raise NotImplementedError
