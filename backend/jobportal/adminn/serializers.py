from rest_framework import serializers
from .models import notification
from .models import Admin

class notificationserializer(serializers.ModelSerializer):
    class Meta:
        model=notification
        fields='__all__'

class adminserializer(serializers.ModelSerializer):
    class Meta:
        model=Admin
        fields='__all__'


