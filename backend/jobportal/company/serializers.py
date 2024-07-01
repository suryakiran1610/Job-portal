from rest_framework import serializers
from .models import jobpost
from .models import jobcategories
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    company_sectors = serializers.StringRelatedField(many=True)
    department_name = serializers.StringRelatedField(many=True)

    class Meta:
        model = Company
        fields = "__all__"


class jobpostserializer(serializers.ModelSerializer):
    class Meta:
        model=jobpost
        fields='__all__'

class jobcategoriesserializer(serializers.ModelSerializer):
    class Meta:
        model=jobcategories
        fields='__all__'

        

