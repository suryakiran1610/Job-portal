from django.contrib import admin
from .models import Jobseeker
from .models import Skill

admin.site.register(Jobseeker)
admin.site.register(Skill)

