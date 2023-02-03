from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path, path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import views
from .auth import urls as auth_urls


# custom 404 route which can be triggered by any HTTP methods
@api_view(['get', 'post', 'put', 'delete', 'options', 'head'])
def custom_404(_):
    return Response({}, status=404)


# Wire up our API using automatic URL routing
# Additionally, we include login URLs for the browsable API
urlpatterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [
    # Basics routing using router
    # path('api/', include(router.urls)),

    # Authentication API
    path('api/', include(auth_urls.auth_patterns)),

    # Application settings route
    path('api/config', views.app_config, name='app_config'),

    # API 404 route
    re_path(r'api/?.*', custom_404),
]