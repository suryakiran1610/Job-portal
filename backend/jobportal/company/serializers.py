from rest_framework import serializers
from .models import jobpost
from .models import jobcategories

class jobpostserializer(serializers.ModelSerializer):
    class Meta:
        model=jobpost
        fields='__all__'

class jobcategoriesserializer(serializers.ModelSerializer):
    class Meta:
        model=jobcategories
        fields='__all__'

        

