from rest_framework import serializers
from .models import user
from adminn.models import notification
from adminn.models import Admin


class userserializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['email', 'password', 'username','user_type','date_joined','is_active','id']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        is_active = True
        if validated_data['user_type'] == 'employer':
            is_active = False

        user1 = user(
            email=validated_data['email'],
            username=validated_data.get('username'),
            user_type=validated_data['user_type'],
            is_active=is_active,
        )
        user1.set_password(validated_data['password'])
        user1.save()

        return user1
