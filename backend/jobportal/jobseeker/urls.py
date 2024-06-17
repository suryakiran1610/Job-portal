from django.urls import path
from . import views

urlpatterns = [
    path('getalljobs/',views.GetallJobs.as_view(),name="getalljobs"),
    path('applyjob/',views.ApplyJob.as_view(),name="applyjob"),
    path('savejob/', views.SaveJobView.as_view(), name='savejob'),
    path('limitsavejobview/', views.LimitSaveJobView.as_view(), name='limitsavejobview'),
    path('limitappliedjobview/', views.LimitAppliedJobView.as_view(), name='limitappliedjobview'),

]
