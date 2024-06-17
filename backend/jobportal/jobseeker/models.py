from django.db import models


class applyjob(models.Model):
    job_id = models.IntegerField(blank=True, null=True)
    jobtitle = models.CharField(max_length=255,null=True,blank=True)
    companyname = models.CharField(max_length=255,blank=True, null=True)
    companyuserid=models.IntegerField(null=True,blank=True)
    applieddate=models.DateField(auto_now_add=True,blank=True, null=True)
    user_id = models.IntegerField(null=True,blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    username=models.CharField(max_length=255,blank=True, null=True)

class savejob(models.Model):
    jobid=models.CharField(max_length=255,null=True,blank=True)
    job_title = models.CharField(max_length=255,null=True,blank=True)
    userid = models.IntegerField(null=True,blank=True)
    company_name = models.CharField(max_length=255,blank=True, null=True)
    saveddate=models.DateField(auto_now_add=True,blank=True, null=True)



