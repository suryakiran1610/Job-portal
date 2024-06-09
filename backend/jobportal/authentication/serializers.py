from rest_framework import serializers
from .models import user

class userserializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['email', 'password', 'username', 'companyname', 'usertype']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user1 = user(
            email=validated_data['email'],
            username=validated_data.get('username', ''),
            companyname=validated_data.get('companyname', ''),
            usertype=validated_data['usertype'],
        )
        user1.set_password(validated_data['password'])
        user1.save()
        return user1
