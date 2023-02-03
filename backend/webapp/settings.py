import appsettings
from django.core.validators import URLValidator


class WebAppSettings(appsettings.AppSettings):
    class Meta:
        setting_prefix = 'webapp_'

    auth = appsettings.NestedDictSetting(
        default=None,
        required=False,
        settings=dict(
            password=appsettings.NestedDictSetting(
                required=False,
                default={'enable': True},
                settings=dict(
                    enable=appsettings.BooleanSetting(default=True, required=True),
                )
            ),
            discord=appsettings.NestedDictSetting(
                required=False,
                settings=dict(
                    enable=appsettings.BooleanSetting(default=False, required=True),
                    client_id=appsettings.StringSetting(required=True),
                    client_secret=appsettings.StringSetting(required=True),
                    redirect_uri=appsettings.StringSetting(required=True, validators=[URLValidator()])
                )
            ),

            github=appsettings.NestedDictSetting(
                required=False,
                settings=dict(
                    enable=appsettings.BooleanSetting(default=True),
                    client_id=appsettings.StringSetting(required=True),
                    client_secret=appsettings.StringSetting(required=True),
                    redirect_uri=appsettings.StringSetting(required=True, validators=[URLValidator()])
                )
            )
        )
    )


webapp_settings = WebAppSettings()
