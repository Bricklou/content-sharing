from django.db import models

from webapp.models import User


class UserAuth(models.Model):
    class Meta:
        unique_together = ('provider', 'user_id',)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class AuthProvider(models.TextChoices):
        GITHUB = 'github'
        DISCORD = 'discord'

    provider = models.CharField(max_length=20, choices=AuthProvider.choices)

    remote_user_id = models.CharField(max_length=255)

    def __repr__(self):
        return f'<UserAuth {self.provider} {self.remote_user_id}>'

    def __str__(self):
        return f'{self.user.username}\'s {self.provider} account link'
