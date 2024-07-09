from django.db import models
from authentication.models import user

class Department(models.Model):
    name = models.CharField(max_length=100)
        
    def __str__(self):
        return self.name

class CompanySector(models.Model):
    sector_name = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.sector_name
    
class CompanyDepartment(models.Model):
    department_name = models.CharField(max_length=100, null=True)
    sector = models.ForeignKey(CompanySector, on_delete=models.CASCADE, null=True)
    companyid=models.IntegerField(null=True,blank=True)

    def __str__(self):
        return self.department_name        

class Company(models.Model):
    company_user_id = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True)
    company_name = models.CharField(max_length=255, unique=True,blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    pin_code = models.CharField(max_length=10, blank=True, null=True)
    profile_image = models.ImageField(upload_to="company_logo",blank=True, null=True)
    is_verified = models.BooleanField(default=False,blank=True, null=True)
    company_website = models.CharField(max_length=100,blank=True, null=True)
    date_joined = models.DateField(auto_now_add=True,blank=True, null=True)

class CompanyEmployee(models.Model):
    company_user_id = models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    employee_name = models.CharField(max_length=100, null=True)
    employee_position = models.CharField(max_length=100, null=True)
    employee_phone_number = models.CharField(max_length=20, null=True)
    employee_email = models.CharField(max_length=50, null=True)
    employee_department = models.CharField(max_length=255, null=True)


class jobpost(models.Model):
    company_user_id = models.ForeignKey(user, on_delete=models.CASCADE, blank=True, null=True)
    jobtitle = models.CharField(max_length=255,null=True,blank=True)
    jobcategory = models.CharField(max_length=255,null=True,blank=True)
    jobnature = models.CharField(max_length=255,null=True,blank=True)
    jobvacancy = models.IntegerField(null=True,blank=True)
    jobsalary = models.CharField(max_length=255,null=True,blank=True)
    joblocation = models.CharField(max_length=255,null=True,blank=True)
    joblocationstate= models.CharField(max_length=255,null=True,blank=True)
    jobdescription = models.CharField(max_length=1000,null=True,blank=True)
    jobresponsibility = models.CharField(max_length=1000, null=True, blank=True)
    jobqualification= models.CharField(max_length=1000,null=True,blank=True)
    jobexperiance = models.IntegerField(null=True,blank=True)
    jobkeywords = models.CharField(max_length=355,null=True,blank=True)
    companyname = models.CharField(max_length=255,blank=True, null=True)
    companylocation = models.CharField(max_length=255, blank=True, null=True)
    companywebsite = models.CharField(max_length=255, blank=True, null=True)
    jobposteddate = models.DateField(auto_now_add=True,blank=True, null=True)

class JobpostedHistory(models.Model):
    company_user_id = models.IntegerField(null=True,blank=True)
    jobtitle = models.CharField(max_length=255,null=True,blank=True)
    jobcategory = models.CharField(max_length=255,null=True,blank=True)
    jobnature = models.CharField(max_length=255,null=True,blank=True)
    jobvacancy = models.IntegerField(null=True,blank=True)
    jobsalary = models.CharField(max_length=255,null=True,blank=True)
    joblocation = models.CharField(max_length=255,null=True,blank=True)
    joblocationstate= models.CharField(max_length=255,null=True,blank=True)
    jobdescription = models.CharField(max_length=1000,null=True,blank=True)
    jobresponsibility = models.CharField(max_length=1000, null=True, blank=True)
    jobqualification= models.CharField(max_length=1000,null=True,blank=True)
    jobexperiance = models.IntegerField(null=True,blank=True)
    jobkeywords = models.CharField(max_length=355,null=True,blank=True)
    companyname = models.CharField(max_length=255,blank=True, null=True)
    companylocation = models.CharField(max_length=255, blank=True, null=True)
    companywebsite = models.CharField(max_length=255, blank=True, null=True)
    jobposteddate = models.DateField(auto_now_add=True,blank=True, null=True)  
    jobstatus= models.BooleanField(blank=True, null=True)
    jobid=models.IntegerField(null=True,blank=True)

class jobcategories(models.Model):
    jobcategory=models.CharField(max_length=255,null=True,blank=True)
    isapproved=models.BooleanField(default=False,blank=True, null=True)
    category_added_by=models.IntegerField(null=True,blank=True)

    def __str__(self):
        return self.jobcategory