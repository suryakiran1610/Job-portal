from rest_framework import serializers
from .models import user
from adminn.models import notification

class userserializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['email', 'password', 'username', 'companyname', 'usertype','mobile','address','profile_image','fullname','date_joined','is_active','id']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        is_active = True
        if validated_data['usertype'] == 'employer':
            is_active = False

        user1 = user(
            email=validated_data['email'],
            username=validated_data.get('username'),
            companyname=validated_data.get('companyname'),
            fullname=validated_data.get('fullname'),
            mobile=validated_data.get('mobile'),
            profile_image=validated_data.get('profile_image'),
            address=validated_data.get('address'),
            usertype=validated_data['usertype'],
            is_active=is_active,
        )
        user1.set_password(validated_data['password'])
        user1.save()

        if user1.usertype == 'employer':
            notification.objects.create(
                message="New Company Registered",
                companyname=user1.companyname,
                companyid=user1.id
            )

        return user1
