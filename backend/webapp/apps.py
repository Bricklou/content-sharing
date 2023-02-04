import logging

from django.apps import AppConfig
from django.conf import settings

from webapp.settings import WebAppSettings

logger = logging.getLogger("django")
if settings.DEBUG:
    logger.setLevel(logging.DEBUG)
else:
    logger.setLevel(logging.INFO)


class WebappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webapp'

    def ready(self):
        WebAppSettings.check()
