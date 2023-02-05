from rest_framework import serializers

from webapp.models.user_auth import UserAuth


class UserSignInSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)


class ProvidedUserSerializer(serializers.Serializer):
    id = serializers.CharField()
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    avatar = serializers.URLField()
    provider = serializers.CharField()

    def to_database_user(self) -> UserAuth | None:
        return UserAuth.objects.filter(
            remote_user_id=self.data['id'],
            provider=self.data['provider']
        ).first()
