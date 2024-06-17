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

from company.models import jobpost
from .models import savejob
from .models import applyjob
from company.serializers import jobpostserializer
from .serializers import savejobserializer
from .serializers import applyjobserializer

class GetallJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = int(request.query_params.get('limit', 6))
        start_index = int(request.query_params.get('startIndex', 0))
        keywords = request.query_params.get('keywords', '').strip()
        location = request.query_params.get('location', '').strip()

        jobs = jobpost.objects.all()

        if keywords:
            jobs = jobs.filter(
                Q(jobtitle__icontains=keywords) |
                Q(companyname__icontains=keywords) |
                Q(jobkeywords__icontains=keywords)
            )
        
        if location:
            jobs = jobs.filter(
                Q(joblocation__icontains=location) |
                Q(joblocationstate__icontains=location)
            )    

        jobs = jobs[start_index:start_index + limit]
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
    

        





