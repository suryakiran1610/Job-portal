from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404


from company.models import jobpost
from company.models import jobcategories
from .models import savejob
from .models import applyjob
from .models import Jobseeker
from .models import JobseekerEducation
from .models import JobseekerExperience
from .models import Skill
from company.serializers import jobpostserializer
from company.serializers import jobcategoriesserializer
from .serializers import savejobserializer
from .serializers import applyjobserializer
from .serializers import JobseekerSerializer
from .serializers import JobseekerEducationSerializer
from .serializers import JobseekerExperienceSerializer
from .serializers import SkillSerializer


class JobseekerPersonalInfo(APIView):

    def post(self, request, *args, **kwargs):
        user_id = int(request.query_params.get('user_id'))
        try:
            employee = Jobseeker.objects.get(user_id=user_id)
            serializer = JobseekerSerializer(employee, data=request.data)
        except Jobseeker.DoesNotExist:
            serializer = JobseekerSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Jobseekereducation(APIView):

    def post(self, request, *args, **kwargs):
        serializer = JobseekerEducationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id is not None:
            education = JobseekerEducation.objects.filter(user_id=user_id)
            serializer = JobseekerEducationSerializer(education, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    

class Jobseekerexperience(APIView):
    def post(self, request, *args, **kwargs):
        serializer = JobseekerExperienceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id is not None:
            experience = JobseekerExperience.objects.filter(user_id=user_id)
            serializer = JobseekerExperienceSerializer(experience, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    

class UploadResume(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = int(request.query_params.get('user_id'))
            
            employee = Jobseeker.objects.get(user_id=user_id)

            resume_file = request.FILES.get('resume')

            employee.resume = resume_file
            employee.save()

            return Response({"message": "Resume uploaded successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class JobCategoryCreate(APIView):

    def post(self, request, *args, **kwargs):
        category_id = request.data.get("category_id")
        user_id = int(request.query_params.get('user_id'))
        if not category_id:
            return Response({"error": "Category ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job_Category = jobcategories.objects.get(id=category_id)
        except jobcategories.DoesNotExist:
            return Response({"error": "Job category does not exist"}, status=status.HTTP_404_NOT_FOUND)

        try:
            employee = Jobseeker.objects.get(user_id=user_id)
            employee.job_category = job_Category
            employee.save()
            return Response({"message": "Job category selected successfully"}, status=status.HTTP_200_OK)
        except Jobseeker.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)        


class JobseekerSkills(APIView):
    def post(self, request):
        user_id = int(request.query_params.get('user_id'))
        employee = Jobseeker.objects.get(user_id=user_id)
        skill_names = request.data.get("skills", [])

        if not skill_names:
            return Response(
                {"error": "Skills are required"}, status=status.HTTP_400_BAD_REQUEST
            )

        for skill_name in skill_names:
            skill, created = Skill.objects.get_or_create(name=skill_name)
            employee.skills.add(skill)

        return Response(
            {"message": "Skills added successfully"}, status=status.HTTP_201_CREATED
        )




class GetallJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = int(request.query_params.get('limit', 6))
        start_index = int(request.query_params.get('startIndex', 0))
        keywords = request.query_params.get('keywords', '').strip()
        location = request.query_params.get('location', '').strip()

        filters = Q()
        if keywords:
            filters &= (
                Q(jobtitle__icontains=keywords) |
                Q(companyname__icontains=keywords) |
                Q(jobkeywords__icontains=keywords)
            )

        if location:
            filters &= (
                Q(joblocation__icontains=location) |
                Q(joblocationstate__icontains=location)
            )

        jobs = jobpost.objects.filter(filters).order_by('-jobposteddate')[start_index:start_index + limit]
        serializer = jobpostserializer(jobs, many=True)
        return Response(serializer.data)

class ApplyJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        serializer=applyjobserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        userid = int(request.query_params.get('userid'))
        jobs=applyjob.objects.filter(user_id=userid)
        serializer=applyjobserializer(jobs,many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        print(request.data)
        jobid = int(request.query_params.get('jobid'))
        try:
            appliedjob = applyjob.objects.get(id=jobid)
        except applyjob.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        appliedjob.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class SaveJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = savejobserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        userid = int(request.query_params.get('userid'))
        jobs = savejob.objects.filter(userid=userid)
        serializer = savejobserializer(jobs, many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        print(request.data)
        jobid = int(request.query_params.get('jobid'))
        try:
            savedjob = savejob.objects.get(id=jobid)
        except savejob.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        savedjob.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class LimitSaveJobView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))
        id=int(request.query_params.get('user_id'))

        jobs =savejob.objects.filter(userid=id)
        jobs=jobs[start_index:start_index+limit]

        serializer=savejobserializer(jobs,many=True)
        return Response(serializer.data)


class LimitAppliedJobView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))
        id=int(request.query_params.get('user_id'))

        jobs =applyjob.objects.filter(user_id=id)
        jobs=jobs[start_index:start_index+limit]

        serializer=applyjobserializer(jobs,many=True)
        return Response(serializer.data)

class Alljobs(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        
        jobs =applyjob.objects.filter(user_id=id)
        jobs=jobs[start_index:start_index+limit]

        serializer=applyjobserializer(jobs,many=True)
        return Response(serializer.data)    

        





