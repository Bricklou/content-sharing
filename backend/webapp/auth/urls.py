from django.urls import path

from . import views

auth_patterns = [
    path('auth/csrf', views.signin_set_cookie, name='csrf'),
    path('auth', views.UserView.as_view(), name='user'),
    path('auth/check', views.check_user, name='user'),
    path('auth/register', views.UserRegisterView.as_view(), name='signin'),

    path('oauth2', views.OAuth2View.as_view(), name='oauth'),
]
