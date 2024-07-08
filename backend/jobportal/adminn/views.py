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
from company.models import jobcategories
from jobseeker.models import Jobseeker
from jobseeker.models import Skill
from jobseeker.models import savejob
from jobseeker.models import applyjob

from company.models import Company
from company.models import CompanyDepartment
from .models import notification
from .models import Admin
from company.models import CompanySector
from company.serializers import jobpostserializer
from company.serializers import jobcategoriesserializer
from company.serializers import CompanySectorSerializer
from jobseeker.serializers import JobseekerSerializer
from company.serializers import CompanySerializer
from authentication.serializers import userserializer
from .serializers import notificationserializer
from .serializers import adminserializer


class AdminprofileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = int(request.query_params.get('user_id'))
        print("Logged-in user's id:", user_id)
        try:
            admin = Admin.objects.get(admin_user_id=user_id)
            serializer = adminserializer(admin)
            data = serializer.data
            return Response(data)
        except Admin.DoesNotExist:
            return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)  

    def post(self, request):
        print(request.data)  # Log the request data
        user_id = int(request.query_params.get('user_id'))

        try:
            User = user.objects.get(id=user_id)
        except user.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            editprofile = Admin.objects.get(admin_user_id=User)
            # If admin exists, update the details
            serializer = adminserializer(editprofile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print(serializer.errors)  # Log the serializer errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Admin.DoesNotExist:
            # If admin does not exist, create a new admin
            data = request.data.copy()
            data['admin_user_id'] = User.id  # Add user id to the data
            serializer = adminserializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)  # Log the serializer errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 


class AddJobcategory(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        data = request.data.copy()
        data['isapproved'] = True
        serializer=jobcategoriesserializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        print(request.data)
        categoryid=int(request.query_params.get('categoryid'))
        category = jobcategories.objects.get(id=categoryid)
        category.isapproved = 1
        category.save()

        try:
            Notification = notification.objects.get(jobcategoryid=categoryid)
        except notification.DoesNotExist:
            return Response({'error': 'notification not found'}, status=status.HTTP_404_NOT_FOUND)

        Notification.isread = 1
        Notification.save()

        return Response({'message': 'category approved'}, status=status.HTTP_200_OK)


class GetallJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = jobpost.objects.all().count()        
        # Calculate the number of job posts in the last 7 days
        seven_days_ago = now() - timedelta(days=7)
        recent_jobs_count = jobpost.objects.filter(jobposteddate__gte=seven_days_ago).count()
        
        response_data = {
            'jobs':jobs,
            'recent_jobs_count': recent_jobs_count,
        }
        
        return Response(response_data)

class Getallcompany(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = Company.objects.all()
        serializer = CompanySerializer(company, many=True)
        company = Company.objects.all().count()
        
        # Calculate the number of job posts in the last 7 days
        seven_days_ago = now() - timedelta(days=7)
        recent_company_count = Company.objects.filter(date_joined__gte=seven_days_ago).count()

        not_activated_companies=Company.objects.filter(is_verified = 0).count()

        
        response_data = {
            'company': serializer.data,
            'companycount':company,
            'recent_company_count': recent_company_count,
            'notactivatedcompanies':not_activated_companies
        }     
        return Response(response_data)
    
    def delete(self, request):
        print(request.data)
        companyid = int(request.query_params.get('companyid'))
        try:
            company = Company.objects.get(company_user_id=companyid)
            dept=CompanyDepartment.objects.filter(companyid=companyid)
            company_user = user.objects.get(id=companyid)

        except Company.DoesNotExist:
            return Response({'error': 'company not found'}, status=404)

        company.delete()
        dept.delete()
        company_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request):
        companyid = int(request.query_params.get('companyid'))
        try:
            company = Company.objects.get(company_user_id=companyid)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        company.is_verified = 1
        company.save()
        
        try:
            company_user = user.objects.get(id=companyid)
        except user.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        company_user.is_active = 1
        company_user.save()

        try:
            Notification = notification.objects.get(companyid=companyid)
        except notification.DoesNotExist:
            return Response({'error': 'notification not found'}, status=status.HTTP_404_NOT_FOUND)

        Notification.isread = 1
        Notification.save()

        return Response({'message': 'User activated'}, status=status.HTTP_200_OK)


class Getalljobseeker(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobseeker = Jobseeker.objects.all().count()
        
        seven_days_ago = now() - timedelta(days=7)
        recent_jobseeker_count = Jobseeker.objects.filter(date_joined__gte=seven_days_ago).count()
        
        response_data = {
            'jobseeker':jobseeker,
            'recent_jobseeker_count': recent_jobseeker_count
        }        
        return Response(response_data)
    
    def delete(self, request):
        print(request.data)
        userid = int(request.query_params.get('userid'))
        try:
            User = user.objects.get(id=userid)
            skill=Skill.objects.filter(user_id=userid)
            appliedjob=applyjob.objects.filter(user_id=userid)
            savedjob=savejob.objects.filter(userid=userid)
        except Jobseeker.DoesNotExist:
            return Response({'error': 'user not found'}, status=404)

        User.delete()
        skill.delete()
        appliedjob.delete()
        savedjob.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GetallCompanysector(APIView):
    def get(self,request):
        sector=CompanySector.objects.all()
        serializer=CompanySectorSerializer(sector,many=True)
        return Response(serializer.data)

class GetjobcategoryNotification(APIView):
    def get(self, request):
        notifications = notification.objects.filter(notificationtype='add_jobcategory_request',isread=0)
        serializer = notificationserializer(notifications, many=True)
        return Response(serializer.data)

class GetSectorNotification(APIView):
    def get(self, request):
        notifications = notification.objects.filter(notificationtype='sector_created',isread=0)
        serializer = notificationserializer(notifications, many=True)
        return Response(serializer.data)

class ChangeSectorstatus(APIView):
    permission_classes = [IsAuthenticated]

    def put(self,request):
        print(request.data)
        sectorid=int(request.query_params.get('sectorid'))
        sector = CompanySector.objects.get(id=sectorid)
        sector.is_verified = 1
        sector.save()

        try:
            Notification = notification.objects.get(jobcategoryid=sectorid)
        except notification.DoesNotExist:
            return Response({'error': 'notification not found'}, status=status.HTTP_404_NOT_FOUND)

        Notification.isread = 1
        Notification.save()

        return Response({'message': 'sector approved'}, status=status.HTTP_200_OK)
        

class LimitCompanyView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))

        company =Company.objects.all()
        company=company[start_index:start_index+limit]

        serializer=CompanySerializer(company,many=True)
        return Response(serializer.data)

class LimitjobseekerView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))

        jobseeker =Jobseeker.objects.all()
        jobseeker=jobseeker[start_index:start_index+limit]

        serializer=JobseekerSerializer(jobseeker,many=True)
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

    def get(self, request):
        notifications = notification.objects.all()
        serializer = notificationserializer(notifications, many=True)

        unreadnotifications = notification.objects.filter(isread=0).count()

        
        response_data = {
            'notification': serializer.data,
            'unreadnotificationcount': unreadnotifications,
        }
        
        return Response(response_data)
    
class AllJobcategory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        category=jobcategories.objects.all()
        serializer=jobcategoriesserializer(category,many=True)
        return Response(serializer.data)  
      

class Deletecompany_DeleteNotification(APIView): 
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        print(request.data)
        companyid = int(request.query_params.get('companyid'))
        try:
            company_user = user.objects.get(id=companyid)
            notifications=notification.objects.get(companyid=companyid)
            dept=CompanyDepartment.objects.filter(companyid=companyid)
        except user.DoesNotExist:
            return Response({'error': 'company not found'}, status=404)

        company_user.delete()
        notifications.delete()
        dept.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class Deletecategory_DeleteNotification(APIView): 
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        print(request.data)
        categoryid = int(request.query_params.get('categoryid'))
        try:
            category = jobcategories.objects.get(id=categoryid)
            notifications=notification.objects.get(jobcategoryid=categoryid)
        except jobcategories.DoesNotExist:
            return Response({'error': 'category not found'}, status=404)

        category.delete()
        notifications.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Deletesector_DeleteNotification(APIView): 
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        print(request.data)
        sectorid = int(request.query_params.get('sectorid'))
        try:
            sector = CompanySector.objects.get(id=sectorid)
            notifications=notification.objects.get(jobcategoryid=sectorid)
        except CompanySector.DoesNotExist:
            return Response({'error': 'sector not found'}, status=404)

        sector.delete()
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
   