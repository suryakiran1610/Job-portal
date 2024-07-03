from rest_framework import serializers
from .models import applyjob
from .models import savejob
from .models import Skill
from .models import Jobseeker
from .models import JobseekerEducation
from .models import JobseekerExperience


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class JobseekerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobseeker
        fields = "__all__"


class JobseekerEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobseekerEducation
        fields = "__all__"

class JobseekerExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobseekerExperience
        fields = "__all__"


class applyjobserializer(serializers.ModelSerializer):
    class Meta:
        model=applyjob
        fields='__all__'

class savejobserializer(serializers.ModelSerializer):
    class Meta:
        model=savejob
        fields='__all__'

        

