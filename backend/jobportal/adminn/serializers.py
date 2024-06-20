from rest_framework import serializers
from .models import notification

class notificationserializer(serializers.ModelSerializer):
    class Meta:
        model=notification
        fields='__all__'


