from django.db import models
from authentication.models import user


class jobpost(models.Model):
    company_user_id = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True)
    jobtitle = models.CharField(max_length=255,null=True,blank=True)
    jobcategory = models.CharField(max_length=255,null=True,blank=True)
    jobnature = models.CharField(max_length=255,null=True,blank=True)
    jobvacancy = models.IntegerField(null=True,blank=True)
    jobsalary = models.CharField(max_length=255,null=True,blank=True)
    joblocation = models.CharField(max_length=255,null=True,blank=True)
    jobdescription = models.CharField(max_length=1000,null=True,blank=True)
    jobresponsibility = models.CharField(max_length=1000, null=True, blank=True)
    jobqualification= models.CharField(max_length=1000,null=True,blank=True)
    jobexperiance = models.IntegerField(null=True,blank=True)
    jobkeywords = models.CharField(max_length=355,null=True,blank=True)
    companyname = models.CharField(max_length=255, unique=True)
    companylocation = models.CharField(max_length=255, blank=True, null=True)
    companywebsite = models.CharField(max_length=255, blank=True, null=True)
    jobposteddate = models.DateField(auto_now_add=True,blank=True, null=True)