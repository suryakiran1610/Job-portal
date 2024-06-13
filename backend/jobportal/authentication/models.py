from django.db import models
from django.contrib.auth.models import AbstractUser

class user(AbstractUser):
    email = models.EmailField(unique=True,null=True,blank=True)
    username = models.CharField(max_length=30, unique=True,null=True,blank=True)
    fullname = models.CharField(max_length=30, unique=True,null=True,blank=True)
    companyname=models.CharField(max_length=30,unique=True,null=True,blank=True)
    usertype=models.CharField(max_length=30,null=True,blank=True)
    address=models.CharField(max_length=30,null=True,blank=True)
    mobile=models.CharField(max_length=11,null=True,blank=True)
    profile_image=models.ImageField(upload_to='profile_image/',null=True,blank=True)

