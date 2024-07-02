from django.contrib import admin
from .models import jobcategories
from .models import Department
from .models import CompanySector
from .models import CompanyDepartment

admin.site.register(jobcategories)
admin.site.register(Department)
admin.site.register(CompanySector)
admin.site.register(CompanyDepartment)


