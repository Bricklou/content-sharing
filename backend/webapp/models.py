from PIL import Image
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
def user_directory_path(instance, _: str) -> str:
    return 'avatars/{0}/{1}'.format(instance.id, "avatar.png")


def resize_with_white_background(pil_image: Image.Image, desired_width, desired_height):
    img_copy = pil_image.copy()

    # get proportioned image ie (if image is 200X600 and trying to resize to 100X200 thumbnail will NOT do this but
    # resize to keep the ratio, so it would be 67x200 to maintain the ratio (uses the larger) img_copy changed in
    # place (does not create new image)
    img_copy.thumbnail((desired_width, desired_height), Image.ANTIALIAS)

    # create white background
    background = Image.new('RGB', (desired_width, desired_height), (255, 255, 255))

    pixels_to_move_left = int((background.width - img_copy.width) * 0.50)  # centered horizontally
    pixels_to_move_down = int((background.height - img_copy.height) * 0.50)  # centered vertically

    # paste image into white background box argument tells where to paste
    background.paste(img_copy, box=(pixels_to_move_left, pixels_to_move_down))

    # this will return the background with img_copy pasted in and will be resized to fit your desired size
    return background


class User(AbstractUser):
    class Meta(AbstractUser.Meta):
        verbose_name = _('user')
        verbose_name_plural = _('users')

    class Theme(models.TextChoices):
        DARK = 'dark'
        LIGHT = 'light'

    first_name = None
    last_name = None

    theme = models.CharField(max_length=5, choices=Theme.choices, default=Theme.LIGHT)
