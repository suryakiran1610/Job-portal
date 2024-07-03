from django.urls import path
from . import views

urlpatterns = [
    path('jobseekerpersonalinfo/',views.JobseekerPersonalInfo.as_view(),name="jobseekerpersonalinfo"),
    path('jobseekereducation/',views.Jobseekereducation.as_view(),name="jobseekereducation"),
    path('jobseekerexperience/',views.Jobseekerexperience.as_view(),name="jobseekerexperience"),
    path('uploadresume/',views.UploadResume.as_view(),name="uploadresume"),
    path('jobcategorycreate/',views.JobCategoryCreate.as_view(),name="jobcategorycreate"),
    path('jobseekerskills/',views.JobseekerSkills.as_view(),name="jobseekerskills"),
    path('getalljobs/',views.GetallJobs.as_view(),name="getalljobs"),
    path('applyjob/',views.ApplyJob.as_view(),name="applyjob"),
    path('savejob/', views.SaveJobView.as_view(), name='savejob'),
    path('limitsavejobview/', views.LimitSaveJobView.as_view(), name='limitsavejobview'),
    path('limitappliedjobview/', views.LimitAppliedJobView.as_view(), name='limitappliedjobview'),
    path('jobseekerprofileview/', views.JobseekerprofileView.as_view(), name='jobseekerprofileview'),
    path('jobseekereducationview/', views.JobseekerEducationView.as_view(), name='jobseekereducationview'),
    path('jobseekerexperienceview/', views.JobseekerExperienceView.as_view(), name='jobseekerexperienceview'),
    path('jobseekerskillsview/', views.JobseekerSkillsView.as_view(), name='jobseekerskillsview'),



]
