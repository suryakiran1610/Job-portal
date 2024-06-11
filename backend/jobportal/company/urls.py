from django.urls import path
from . import views

urlpatterns = [
    path('postjob/',views.PostJob.as_view(),name="postjob"),

]
