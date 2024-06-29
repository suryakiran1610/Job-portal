from django.db import models

class notification(models.Model):
    message=models.CharField(max_length=250,null=True,blank=True)
    isread=models.BooleanField(default=False)
    companyname = models.CharField(max_length=255,blank=True, null=True)
    companyid=models.IntegerField(null=True,blank=True)
    registereddate=models.DateField(auto_now_add=True,blank=True, null=True)
    notificationtype=models.CharField(max_length=250,null=True,blank=True)
    jobcategoryid=models.IntegerField(null=True,blank=True)
