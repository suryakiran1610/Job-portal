from django.urls import path
from . import views

urlpatterns = [
    path('getalljobs/',views.GetallJobs.as_view(),name="getalljobs"),

]
