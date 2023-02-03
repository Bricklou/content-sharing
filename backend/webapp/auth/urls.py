from django.urls import path

from . import views
from ..settings import webapp_settings

auth_patterns = [
    path('auth/csrf', views.login_set_cookie, name='csrf'),
    path('auth', views.UserView.as_view(), name='user'),
]


# Enable OAuth2 route for GitHub
if 'github' in webapp_settings.auth and len(webapp_settings.auth['github']) > 0 \
        and webapp_settings.auth['github']['enable']:
    auth_patterns += [

    ]

# Enable OAuth2 route for Discord
if 'discord' in webapp_settings.auth and len(webapp_settings.auth['discord']) > 0 \
        and webapp_settings.auth['discord']['enable']:
    auth_patterns += []
