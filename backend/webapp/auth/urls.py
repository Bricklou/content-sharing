from django.urls import path

from . import views

auth_patterns = [
    path('auth/csrf', views.login_set_cookie, name='csrf'),
    path('auth', views.UserView.as_view(), name='user'),

    path('oauth2', views.OAuth2View.as_view(), name='oauth'),
]
