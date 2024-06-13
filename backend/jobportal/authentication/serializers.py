from rest_framework import serializers
from .models import user

class userserializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['email', 'password', 'username', 'companyname', 'usertype','mobile','address','profile_image','fullname']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user1 = user(
            email=validated_data['email'],
            username=validated_data.get('username'),
            companyname=validated_data.get('companyname'),
            fullname=validated_data.get('fullname'),
            mobile=validated_data.get('mobile'),
            profile_image=validated_data.get('profile_image'),
            address=validated_data.get('address'),
            usertype=validated_data['usertype'],
        )
        user1.set_password(validated_data['password'])
        user1.save()
        return user1
