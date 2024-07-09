from rest_framework import serializers
from .models import jobpost
from .models import JobpostedHistory
from .models import jobcategories
from .models import Company
from .models import Department
from .models import CompanyDepartment
from .models import CompanySector
from .models import CompanyEmployee

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = "__all__"


class jobpostserializer(serializers.ModelSerializer):
    class Meta:
        model=jobpost
        fields='__all__'

class jobpostedhistoryserializer(serializers.ModelSerializer):
    class Meta:
        model=JobpostedHistory
        fields='__all__'
        
    def create(self, validated_data):
        validated_data['company_user_id'] = validated_data['company_user_id'].id
        return super().create(validated_data)    

class jobcategoriesserializer(serializers.ModelSerializer):
    class Meta:
        model=jobcategories
        fields='__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class CompanySectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySector
        fields = '__all__'

class CompanyDepartmentSerializer(serializers.ModelSerializer):
    sector_name = serializers.CharField(source='sector.sector_name', read_only=True)
    
    class Meta:
        model = CompanyDepartment
        fields = '__all__'

class CompanyEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyEmployee
        fields = '__all__'        
        

