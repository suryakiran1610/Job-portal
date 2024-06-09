from django.db import models
from django.contrib.auth.models import AbstractUser

class user(AbstractUser):
    email = models.EmailField(unique=True,null=True,blank=True)
    username = models.CharField(max_length=30, unique=True,null=True,blank=True)
    fullname = models.CharField(max_length=30, unique=True,null=True,blank=True)
    companyname=models.CharField(max_length=30,unique=True,null=True,blank=True)
    usertype=models.CharField(max_length=30,null=True,blank=True)
