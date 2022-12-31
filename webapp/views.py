from django.contrib.auth.models import User, Group
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from rest_framework import viewsets, permissions

from webapp.serializers import UserSerializer, GroupSerializer


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or editor
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'webapp/index.html')
