from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import userserializer
from .models import user
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
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            payload = {'user': user.username}  # Initialize payload with username
            
            if user.is_superuser:
                payload['user_type'] = 'superuser'
            elif user.usertype == 'jobseeker':
                payload['user_type'] = 'jobseeker'
            elif user.usertype == 'employer':
                payload['user_type'] = 'employer'

            refresh = RefreshToken.for_user(user)
            refresh.payload = payload  # Assign the constructed payload
            
            return Response({"token":str(refresh.access_token)})
        else:
            return Response({"error": "Invalid Credentials"})



class UsersView(APIView):
    def get(self, request):
        users = user.objects.all()
        serializer = userserializer(users, many=True)
        return Response(serializer.data)
    