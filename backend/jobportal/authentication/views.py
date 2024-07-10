from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import userserializer
from .models import user
from jobseeker.models import Jobseeker
from company.models import Company
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken



class Registerview(APIView):
    def post(self, request):
        serializer = userserializer(data=request.data)
        print(request.data)

        if serializer.is_valid():
            user = serializer.save()
            response_serializer = userserializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class LoginView(APIView):
    def post(self, request):
        username_email = request.data.get('username')
        password = request.data.get('password')

        try:
            if '@' in username_email:
                user1 = user.objects.get(email=username_email)
            else:
                user1 = user.objects.get(username=username_email)
        except user.DoesNotExist:
            user1 = None        

        if user1 is not None and user1.check_password(password):
            if not user1.is_active:
                return Response({"error": "Account is not active."}, status=status.HTTP_401_UNAUTHORIZED)
            
            refresh = RefreshToken.for_user(user1)
            user_details = {
                'id': user1.id,
                'username': user1.username,
                'email': user1.email,
            }

            if user1.is_superuser:
                user_details['user_type'] = 'superuser'
            else:
                user_details['user_type'] = user1.user_type

                if user1.user_type == 'jobseeker':
                    try:
                        jobseeker_details = Jobseeker.objects.get(user_id=user1.id)
                        user_details['fullname'] = jobseeker_details.full_name
                    except Jobseeker.DoesNotExist:
                        user_details['fullname'] = None
                elif user1.user_type == 'employer':
                    try:
                        company_details = Company.objects.get(company_user_id=user1.id)
                        user_details['companyname'] = company_details.company_name
                    except Company.DoesNotExist:
                        user_details['companyname'] = None
            
            return Response({'token': str(refresh.access_token), 'user': user_details}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
   


class UsersView(APIView):
    def get(self, request):
        users = user.objects.all()
        serializer = userserializer(users, many=True)
        return Response(serializer.data)
    


