import requests
from django.http import StreamingHttpResponse


class ProxyHttpResponse(StreamingHttpResponse):

    def __init__(self, url, headers=None, **kwargs):
        upstream = requests.get(url, stream=True, headers=headers)

        kwargs.setdefault('content_type', upstream.headers.get('content-type'))
        kwargs.setdefault('status', upstream.status_code)
        kwargs.setdefault('reason', upstream.reason)

        super().__init__(upstream.raw, **kwargs)

        for name, value in upstream.headers.items():
            self[name] = value
