from django.db import models
from authentication.models import user
from company.models import jobcategories




class Skill(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)



class Jobseeker(models.Model):
    user_id = models.ForeignKey(user, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255,blank=True, null=True)
    profile_image = models.ImageField(upload_to="profile_image",blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    mobile = models.CharField(max_length=20,blank=True, null=True)
    address_line1 = models.CharField(max_length=255,blank=True, null=True)
    address_line2 = models.CharField(max_length=255,blank=True, null=True)
    city = models.CharField(max_length=255,blank=True, null=True)
    state = models.CharField(max_length=255,blank=True, null=True)
    pin_code = models.CharField(max_length=10,blank=True, null=True)
    job_category = models.ForeignKey(jobcategories, on_delete=models.CASCADE, blank=True, null=True)
    resume = models.FileField(upload_to="resumes",blank=True, null=True) 
    date_joined = models.DateField(auto_now_add=True,blank=True, null=True)

    def __str__(self):
        return self.full_name

class JobseekerEducation(models.Model):
    user_id = models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    course_name = models.CharField(max_length=255, null=True)
    course_description = models.CharField(max_length=500, null=True)
    organization_name= models.CharField(max_length=500, null=True)
    from_date = models.DateField()
    to_date = models.DateField()
    education_document = models.FileField(upload_to="ed_documents/", null=True)    

    
class JobseekerExperience(models.Model):
    user_id = models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    job_title = models.CharField(max_length=255, null=True)
    job_description = models.CharField(max_length=500, null=True)
    company_name = models.CharField(max_length=500, null=True)
    from_date = models.DateField()
    to_date = models.DateField()
    experience_document = models.FileField(upload_to="ex_documents/")


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



