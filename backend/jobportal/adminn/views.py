from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser

from company.models import jobpost
from authentication.models import user
from company.serializers import jobpostserializer
from authentication.serializers import userserializer

class GetallJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = jobpost.objects.all()
        serializer = jobpostserializer(jobs, many=True)
        
        # Calculate the number of job posts in the last 3 days
        three_days_ago = now() - timedelta(days=3)
        recent_jobs_count = jobpost.objects.filter(jobposteddate__gte=three_days_ago).count()
        
        response_data = {
            'jobs': serializer.data,
            'recent_jobs_count': recent_jobs_count
        }
        
        return Response(response_data)

class Getallcompany(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = user.objects.filter(usertype='employer')
        serializer = userserializer(company, many=True)
        
        # Calculate the number of job posts in the last 3 days
        three_days_ago = now() - timedelta(days=3)
        recent_company_count = user.objects.filter(usertype='employer',date_joined__date__gte=three_days_ago).count()
        
        response_data = {
            'jobs': serializer.data,
            'recent_jobs_count': recent_company_count
        }
        
        return Response(response_data)

class Getalljobseeker(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobseeker = user.objects.filter(usertype='jobseeker')
        serializer = userserializer(jobseeker, many=True)
        
        # Calculate the number of job posts in the last 3 days
        three_days_ago = now() - timedelta(days=3)
        recent_jobseeker_count = user.objects.filter(usertype='jobseeker',date_joined__date__gte=three_days_ago).count()
        
        response_data = {
            'jobs': serializer.data,
            'recent_jobs_count': recent_jobseeker_count
        }
        
        return Response(response_data)
