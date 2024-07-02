from django.urls import path
from . import views

urlpatterns = [
    path('companypersonalinfo/',views.CompanyPersonalInfo.as_view(),name="companypersonalinfo"),
    path('updatesectoranddepartments/',views.UpdateSectorAndDepartments.as_view(),name="updatesectoranddepartments"),
    path('getcompanysector/',views.GetCompanysector.as_view(),name="getcompanysector"),
    path('getdepartments/',views.GetDepartments.as_view(),name="getdepartments"),
    path('companyemployee/',views.Companyemployee.as_view(),name="companyemployee"),
    path('getcompanydepartment/',views.GetCompanydepartment.as_view(),name="getcompanydepartment"),
    path('getallpostedjobs/',views.GetallPostedJobs.as_view(),name="getallpostedjobs"),
    path('postjob/',views.PostJob.as_view(),name="postjob"),
    path('viewjob/',views.ViewJob.as_view(),name="viewjob"),
    path('jobcategory/',views.Jobcategory.as_view(),name="jobcategory"),
    path('users/',views.Users.as_view(),name="users"),
    path('passwordchange/',views.PasswordChange.as_view(),name="passwordchange"),
    path('filterapplicants/',views.FilterApplicants.as_view(),name="filterapplicants"),
    path('allapplicants/',views.AllApplicants.as_view(),name="allapplicants"),

]
