from rest_framework import serializers
from .models import applyjob
from .models import savejob

class applyjobserializer(serializers.ModelSerializer):
    class Meta:
        model=applyjob
        fields='__all__'

class savejobserializer(serializers.ModelSerializer):
    class Meta:
        model=savejob
        fields='__all__'

        

