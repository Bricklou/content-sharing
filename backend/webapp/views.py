from django.shortcuts import render
from rest_framework.views import Response, Request
from rest_framework.decorators import api_view
from .settings import webapp_settings


def is_enabled(auth_type: str) -> bool:
    try:
        return webapp_settings.auth[auth_type]['enable']
    except KeyError:
        return False


enabled_auth = [n for n in webapp_settings.auth.keys() if is_enabled(n)]


@api_view(['GET'])
def app_config(request: Request) -> Response:
    return Response({
        "auth": enabled_auth
    })
