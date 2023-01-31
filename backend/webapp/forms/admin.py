from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from image_uploader_widget.widgets import ImageUploaderWidget

from webapp.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = User
        fields = ("username", "email", "avatar", "is_staff",)
        widgets = {
            "avatar": ImageUploaderWidget()
        }


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "email", "avatar", "is_staff",)
        widgets = {
            "avatar": ImageUploaderWidget()
        }
