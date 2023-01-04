from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .auth import urls as auth_urls


@api_view()
def custom_404(_req):
    return Response({}, status=404)


# Wire up our API using automatic URL routing
# Additionally, we include login URLs for the browsable API
urlpatterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [
                  # Basics routing using router
                  # path('api/', include(router.urls)),

                  # Authentication API
                  path('api/auth', include(auth_urls.auth_patterns)),

                  # API 404 route
                  re_path(r'api/?.*', custom_404),

                  # SPA rendering
                  re_path(r'^.*', TemplateView.as_view(template_name="webapp/index.html")),
              ]
