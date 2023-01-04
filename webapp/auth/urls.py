from django.urls import path

from . import views

auth_patterns = [
    path('csrf', views.ensure_csrf_cookie, name='csrf'),
    path('', views.UserView.as_view(), name='user'),

]
