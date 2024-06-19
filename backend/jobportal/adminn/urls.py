from django.urls import path
from . import views

urlpatterns = [
        path('getalljobs/',views.GetallJobs.as_view(),name="getalljobs"),
        path('getallcompany/',views.Getallcompany.as_view(),name="getallcompany"),
        path('getalljobseeker/',views.Getalljobseeker.as_view(),name="getalljobseeker"),

        path('limitjobseekerview/',views.LimitjobseekerView.as_view(),name="limitjobseekerview"),
        path('limitcompanyview/',views.LimitCompanyView.as_view(),name="limitcompanyview"),
        path('limitjobsview/',views.LimitJobsView.as_view(),name="limitjobsview"),



]
