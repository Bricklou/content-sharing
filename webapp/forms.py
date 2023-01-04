from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from webapp.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = User
        fields = ("username", "email", "avatar", "is_staff",)


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "email", "avatar", "is_staff",)
