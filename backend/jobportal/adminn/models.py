from django.db import models
from authentication.models import user



class Admin(models.Model):
    admin_user_id = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True)
    adminname = models.CharField(max_length=255,blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    pin_code = models.CharField(max_length=10, blank=True, null=True)
    profile_image = models.ImageField(upload_to="profileimage",blank=True, null=True)



class notification(models.Model):
    message=models.CharField(max_length=250,null=True,blank=True)
    isread=models.BooleanField(default=False)
    companyname = models.CharField(max_length=255,blank=True, null=True)
    companyid=models.IntegerField(null=True,blank=True)
    registereddate=models.DateField(auto_now_add=True,blank=True, null=True)
    notificationtype=models.CharField(max_length=250,null=True,blank=True)
    jobcategoryid=models.IntegerField(null=True,blank=True)
