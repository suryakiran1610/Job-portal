from django.db import models
from django.contrib.auth.models import AbstractUser

class user(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
