from django.contrib.auth.models import Group
from rest_framework import serializers

from webapp.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'avatar', 'groups', 'is_staff', 'is_active', 'is_superuser']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['name']
