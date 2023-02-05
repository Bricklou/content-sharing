from urllib.parse import unquote

import requests
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.views import Response, Request

from webapp.settings import webapp_settings


@api_view(['GET'])
def app_config(request: Request) -> Response:
    return Response({
        "auth": webapp_settings.get_enabled_auth()
    })


@api_view(['GET'])
def resources_proxy(request):
    """
    Proxy images from the backend and return them to the client
    """
    url = request.query_params.get('url')

    try:
        if url:
            url = unquote(url)

            response = requests.get(url)
            return HttpResponse(response.content, content_type=response.headers['content-type'])
        return Response({"detail": "No url provided"}, status=400)
    except Exception:
        return Response({"detail": "Unexpected error from backend"}, status=500)
