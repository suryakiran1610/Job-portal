from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.parsers import MultiPartParser, FormParser

from .models import jobpost
from .models import jobcategories
from authentication.models import user
from authentication.serializers import userserializer
from .serializers import jobpostserializer
from .serializers import jobcategoriesserializer


class Jobcategory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        category=jobcategories.objects.all()
        serializer=jobcategoriesserializer(category,many=True)
        return Response(serializer.data)




class PostJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        serializer=jobpostserializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company_user_id=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))
        id=int(request.query_params.get('user_id'))

        jobs =jobpost.objects.filter(company_user_id=id)
        jobs=jobs[start_index:start_index+limit]

        serializer=jobpostserializer(jobs,many=True)
        return Response(serializer.data)
    
    def put(self,request):
        print(request.data)
        jobid=int(request.query_params.get('job_id'))
        editjob = jobpost.objects.get(id=jobid)

        serializer =jobpostserializer(editjob,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ViewJob(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        print(request.data)
        jobid=int(request.query_params.get('jobid'))
        job=jobpost.objects.get(id=jobid)

        if job:
            serializer=jobpostserializer(job)
            return Response(serializer.data)
        else:
            return Response({'error': 'Job not found'}, status=404)

    def delete(self, request):
        print(request.data)
        jobid = int(request.query_params.get('jobid'))
        try:
            job = jobpost.objects.get(id=jobid)
        except jobpost.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class Users(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self,request):
        print(request.data)
        userid=int(request.query_params.get('userid'))
        usr=user.objects.get(id=userid)

        if usr:
            serializer=userserializer(usr)
            return Response(serializer.data)
        else:
            return Response({'error': 'Job not found'}, status=404)
        
    def put(self,request):
        print(request.data)
        userid=int(request.query_params.get('userid'))
        editprofile = user.objects.get(id=userid)

        serializer =userserializer(editprofile,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class PasswordChange(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        print(request.data)
        userid = int(request.query_params.get('userid'))
        
        try:
            usr = user.objects.get(id=userid)
        except user.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        old_password = request.data.get('oldpassword')
        new_password = request.data.get('newpassword')
        confirm_password = request.data.get('confirmpassword')

        if not usr.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New password and confirm password do not match'}, status=status.HTTP_400_BAD_REQUEST)

        usr.set_password(new_password)
        usr.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)









