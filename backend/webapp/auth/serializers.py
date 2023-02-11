from rest_framework import serializers

from webapp.models import User
from webapp.models.user_auth import UserAuth
from webapp.utils.validation_errors import VALIDATIONS_ERRORS


class UserSignInSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)


class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, min_length=3, error_messages=VALIDATIONS_ERRORS)
    email = serializers.EmailField(error_messages=VALIDATIONS_ERRORS)
    password = serializers.CharField(max_length=128, min_length=6, required=False, error_messages=VALIDATIONS_ERRORS)
    confirmation = serializers.CharField(max_length=128, min_length=6, required=False,
                                         error_messages=VALIDATIONS_ERRORS)
    avatar = serializers.ImageField(required=False, error_messages=VALIDATIONS_ERRORS, allow_null=True,
                                    allow_empty_file=True, default=None)

    # For Oauth2 registration
    oauth2_id = serializers.CharField(required=False, source='remote_user_id', error_messages=VALIDATIONS_ERRORS,
                                      allow_null=True, allow_blank=True)
    provider = serializers.ChoiceField(required=False, choices=['github', 'discord'], error_messages=VALIDATIONS_ERRORS,
                                       allow_null=True, allow_blank=True)

    class Meta:
        validators = [
            serializers.UniqueTogetherValidator(queryset=User.objects.all(), fields=['username', 'email'],
                                                message=VALIDATIONS_ERRORS['unique']),
            # serializers.UniqueTogetherValidator(queryset=UserAuth.objects.all(), fields=['oauth2_id', 'provider'],
            #                                    message=VALIDATIONS_ERRORS['unique']),
        ]

    def create(self, validated_data) -> User:
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        if 'avatar' in validated_data:
            user.avatar = validated_data['avatar']

        if 'remote_user_id' in validated_data and 'provider' in validated_data:
            UserAuth.objects.create(
                user=user,
                remote_user_id=validated_data['remote_user_id'],
                provider=validated_data['provider'],
            )
        else:
            user.password = validated_data['password']

        return user

    def validate(self, attrs):
        password_auth = 'password' in attrs and 'confirmation' in attrs

        if password_auth:
            self.fields['password'].required = True
            self.fields['confirmation'].required = True
        else:
            self.fields['oauth2_id'].required = True
            self.fields['provider'].required = True

        result = super().validate(attrs)

        if password_auth and attrs['password'] != attrs['confirmation']:
            raise serializers.ValidationError(VALIDATIONS_ERRORS['password_match'])

        return result

    def validate_username(self, value):
        """
        Validate username and check if it is unique
        :param value: username
        :return:
        """
        count = User.objects.filter(username__iexact=value).count()

        if count > 0:
            raise serializers.ValidationError(VALIDATIONS_ERRORS['unique'])

        return value

    def validate_email(self, value):
        """
        Validate email and check if it is unique
        :param value: email
        :return:
        """
        count = User.objects.filter(email__iexact=value).count()

        if count > 0:
            raise serializers.ValidationError(VALIDATIONS_ERRORS['unique'])

        return value


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
