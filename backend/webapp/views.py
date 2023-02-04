from rest_framework.decorators import api_view
from rest_framework.views import Response, Request

from webapp.settings import webapp_settings


@api_view(['GET'])
def app_config(request: Request) -> Response:
    return Response({
        "auth": webapp_settings.get_enabled_auth()
    })
