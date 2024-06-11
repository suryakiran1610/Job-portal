from rest_framework import serializers
from .models import jobpost

class jobpostserializer(serializers.ModelSerializer):
    class Meta:
        model=jobpost
        fields='__all__'
        

