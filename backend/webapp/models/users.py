import time
from io import BytesIO

from PIL import Image
from django.contrib.auth.models import AbstractUser
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.db.models.signals import post_init, post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from webapp.utils.storage import OverwriteStorage


# Create your models here.
def user_directory_path(instance, _: str) -> str:
    timestamp = int(round(time.time()))
    return 'avatars/{0}/avatar_{1}.png'.format(instance.id, timestamp)


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

    avatar = models.ImageField(upload_to=user_directory_path, default=None, storage=OverwriteStorage(), null=True,
                               blank=True)

    def set_image(self, desired_width, desired_height):
        try:
            this = User.objects.get(id=self.id)
        except User.DoesNotExist:
            pass
        else:
            # will not resize or set to new image (this avoids setting image every single time you edit and save
            if this.avatar == self.avatar and \
                    (self.avatar.width, self.avatar.height) == (desired_width, desired_height):
                return

        im = Image.open(BytesIO(self.avatar.read()))

        resized_image = resize_with_white_background(
            pil_image=im,
            desired_width=desired_width,
            desired_height=desired_height
        )

        # output (file like object)
        output = BytesIO()

        # save image into file-like object
        resized_image.save(output, format='PNG', quality=94)

        # get size of file
        a_size = output.tell()

        # reset to beginning of file-like object
        output.seek(0)

        self.avatar.file = InMemoryUploadedFile(
            output,
            'ImageField',
            f"{self.avatar.name.split('.')[0]}__.png",
            'image/png',
            a_size,
            None,

        )

    def save(self, *args, **kwargs):
        if self.avatar:
            self.set_image(
                desired_width=300,
                desired_height=300
            )

        super().save(*args, **kwargs)


@receiver(post_init, sender=User)
def backup_image_path(sender, instance, **kwargs):
    instance._current_imagen_file = instance.avatar


@receiver(post_save, sender=User)
def delete_old_image(sender, instance, **kwargs):
    if hasattr(instance, '_current_imagen_file'):
        if instance._current_imagen_file != instance.avatar:
            instance._current_imagen_file.delete(save=False)
