class Provider:
    """
    Abstract class for OAuth2 provider.
    """

    def authorize(self):
        raise NotImplementedError

    def token(self, response: str):
        raise NotImplementedError

    def get_user(self):
        raise NotImplementedError
