from django.db import models
from authentication.models import user
from company.models import jobcategories




class Skill(models.Model):
    name = models.CharField(unique=True, max_length=255)


    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.capitalize()
        super().save(*args, **kwargs)

class Jobseeker(models.Model):
    user_id = models.ForeignKey(user, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to="profile_image")
    dob = models.DateField()
    mobile = models.CharField(max_length=20)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255,blank=True, null=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    pin_code = models.CharField(max_length=10)
    skills = models.ManyToManyField(Skill,blank=True, null=True)
    job_category = models.ForeignKey(jobcategories, on_delete=models.CASCADE, blank=True, null=True)
    resume = models.FileField(upload_to="resumes", null=True) 

class JobseekerEducation(models.Model):
    user_id = models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    course_name = models.CharField(max_length=255, null=True)
    course_description = models.CharField(max_length=500, null=True)
    organization_name= models.CharField(max_length=500, null=True)
    from_date = models.DateField()
    to_date = models.DateField()
    education_document = models.FileField(upload_to="ed_documents/", null=True)    

    def __str__(self):
        return self.course_name
    
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



