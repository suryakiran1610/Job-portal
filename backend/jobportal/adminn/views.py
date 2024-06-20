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
from .models import notification
from company.serializers import jobpostserializer
from authentication.serializers import userserializer
from .serializers import notificationserializer

class GetallJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = jobpost.objects.all()
        serializer = jobpostserializer(jobs, many=True)
        
        # Calculate the number of job posts in the last 7 days
        seven_days_ago = now() - timedelta(days=7)
        recent_jobs_count = jobpost.objects.filter(jobposteddate__gte=seven_days_ago).count()
        
        response_data = {
            'jobs': serializer.data,
            'recent_jobs_count': recent_jobs_count,
        }
        
        return Response(response_data)

class Getallcompany(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = user.objects.filter(usertype='employer')
        serializer = userserializer(company, many=True)
        
        # Calculate the number of job posts in the last 7 days
        seven_days_ago = now() - timedelta(days=7)
        recent_company_count = user.objects.filter(usertype='employer',date_joined__date__gte=seven_days_ago).count()

        not_activated_companies=user.objects.filter(usertype='employer',is_active = 0).count()

        
        response_data = {
            'company': serializer.data,
            'recent_company_count': recent_company_count,
            'notactivatedcompanies':not_activated_companies
        }     
        return Response(response_data)
    
    def delete(self, request):
        print(request.data)
        companyid = int(request.query_params.get('companyid'))
        try:
            company = user.objects.get(id=companyid)
        except user.DoesNotExist:
            return Response({'error': 'company not found'}, status=404)

        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self,request):
        print(request.data)
        companyid=int(request.query_params.get('companyid'))
        company = user.objects.get(id=companyid)
        company.is_active = 1
        company.save()
        return Response({'message': 'user actiated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class Getalljobseeker(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobseeker = user.objects.filter(usertype='jobseeker')
        serializer = userserializer(jobseeker, many=True)
        
        # Calculate the number of job posts in the last 7 days
        seven_days_ago = now() - timedelta(days=7)
        recent_jobseeker_count = user.objects.filter(usertype='jobseeker',date_joined__date__gte=seven_days_ago).count()
        
        response_data = {
            'jobseeker': serializer.data,
            'recent_jobseeker_count': recent_jobseeker_count
        }        
        return Response(response_data)
    
    def delete(self, request):
        print(request.data)
        userid = int(request.query_params.get('userid'))
        try:
            User = user.objects.get(id=userid)
        except user.DoesNotExist:
            return Response({'error': 'user not found'}, status=404)

        User.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LimitCompanyView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))

        company =user.objects.filter(usertype='employer')
        company=company[start_index:start_index+limit]

        serializer=userserializer(company,many=True)
        return Response(serializer.data)

class LimitjobseekerView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))

        jobseeker =user.objects.filter(usertype='jobseeker')
        jobseeker=jobseeker[start_index:start_index+limit]

        serializer=userserializer(jobseeker,many=True)
        return Response(serializer.data)
    
class LimitJobsView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))

        jobs =jobpost.objects.all()
        jobs=jobs[start_index:start_index+limit]

        serializer=jobpostserializer(jobs,many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        print(request.data)
        jobid = int(request.query_params.get('jobid'))
        try:
            job = jobpost.objects.get(id=jobid)
        except jobpost.DoesNotExist:
            return Response({'error': 'job not found'}, status=404)

        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class GetallNotification(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = notification.objects.all()
        serializer = notificationserializer(notifications, many=True)

        unreadnotifications = notification.objects.filter(isread=0).count()

        
        response_data = {
            'notification': serializer.data,
            'unreadnotificationcount': unreadnotifications,
        }
        
        return Response(response_data)

class Deletecompany_DeleteNotification(APIView): 
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        print(request.data)
        companyid = int(request.query_params.get('companyid'))
        try:
            company = user.objects.get(id=companyid)
            notifications=notification.objects.get(companyid=companyid)
        except user.DoesNotExist:
            return Response({'error': 'company not found'}, status=404)

        company.delete()
        notifications.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DeleteNotification(APIView): 
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        print(request.data)
        notificationid =request.query_params.get('notificationid')
        if notificationid:
            try:
                notifications = notification.objects.get(id=notificationid)
                notifications.delete()
            except notification.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND) 
        else:
            notifications = notification.objects.all()
            notifications.delete()  
        return Response(status=status.HTTP_204_NO_CONTENT)    

class Notificationn_Readed(APIView): 
    permission_classes = [IsAuthenticated]   
       
    def put(self,request):
        print(request.data)
        Notification=int(request.query_params.get('notificationid'))
        notifications = notification.objects.get(id=Notification)
        notifications.isread = 1
        notifications.save()
        return Response({'message': 'Notification Readed'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   