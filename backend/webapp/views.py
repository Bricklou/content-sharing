import urllib
from urllib.parse import unquote

from rest_framework.decorators import api_view
from rest_framework.views import Response, Request

from webapp.settings import webapp_settings
from webapp.utils.proxy_response import ProxyHttpResponse


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
            if url.netloc not in webapp_settings.PROXY_WHITELIST:
                return Response({"detail": "Proxied url not allowed"}, status=403)

            return ProxyHttpResponse(url, headers=request.headers)
        return Response({"detail": "No url provided"}, status=400)
    except Exception:
        return Response({"detail": "Unexpected error from backend"}, status=500)
