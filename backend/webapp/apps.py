from django.apps import AppConfig

from webapp.settings import WebAppSettings


class WebappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webapp'

    def ready(self):
        WebAppSettings.check()
