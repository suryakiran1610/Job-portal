from django.urls import path
from . import views

urlpatterns = [
    path('postjob/',views.PostJob.as_view(),name="postjob"),
    path('viewjob/',views.ViewJob.as_view(),name="viewjob"),
    path('jobcategory/',views.Jobcategory.as_view(),name="jobcategory"),
    path('users/',views.Users.as_view(),name="users"),
    path('passwordchange/',views.PasswordChange.as_view(),name="passwordchange"),
    path('filterapplicants/',views.FilterApplicants.as_view(),name="filterapplicants"),
    path('allapplicants/',views.AllApplicants.as_view(),name="allapplicants"),

]
