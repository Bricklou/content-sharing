import urllib
from urllib.parse import unquote

import requests
from django.conf import settings
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view
from rest_framework.views import Response, Request

from webapp.apps import logger
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

            # Check if the url is in the whitelist
            url = urllib.parse.urlparse(url)
            if url.netloc not in settings.PROXY_WHITELIST:
                return Response({"detail": "Proxied url not allowed"}, status=403)

            response = requests.get(url.geturl(), stream=True)
            return StreamingHttpResponse(
                response.raw,
                content_type=response.headers.get('content-type'),
                status=response.status_code,
                reason=response.reason)
        return Response({"detail": "No url provided"}, status=400)
    except Exception as e:
        logger.error(e)
        return Response({"detail": "Unexpected error from backend"}, status=500)
