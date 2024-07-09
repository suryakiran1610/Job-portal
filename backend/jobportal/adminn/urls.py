from django.urls import path
from . import views

urlpatterns = [
    
        path('adminprofileview/',views.AdminprofileView.as_view(),name="adminprofileview"),

        path('jobcategory/',views.AddJobcategory.as_view(),name="jobcategory"),
        path('getalljobs/',views.GetallJobs.as_view(),name="getalljobs"),
        path('getallcompany/',views.Getallcompany.as_view(),name="getallcompany"),
        path('getalljobseeker/',views.Getalljobseeker.as_view(),name="getalljobseeker"),
        path('getallcompanysector/',views.GetallCompanysector.as_view(),name="getallcompanysector"),
        path('changesectorstatus/',views.ChangeSectorstatus.as_view(),name="changesectorstatus"),



        path('limitjobseekerview/',views.LimitjobseekerView.as_view(),name="limitjobseekerview"),
        path('limitcompanyview/',views.LimitCompanyView.as_view(),name="limitcompanyview"),
        path('limitjobsview/',views.LimitJobsView.as_view(),name="limitjobsview"),
        path('limitfilteredjobsview/',views.LimitFilteredJobsView.as_view(),name="limitfilteredjobsview"),
        path('limitfilteredjobshistory/',views.LimitFilteredJobsHistory.as_view(),name="limitfilteredjobshistory"),

        path('getallnotification/',views.GetallNotification.as_view(),name="getallnotification"),
        path('getjobcategorynotification/',views.GetjobcategoryNotification.as_view(),name="getjobcategorynotification"),
        path('getsectornotification/',views.GetSectorNotification.as_view(),name="getsectornotification"),
        path('deletecompany_deletenotification/',views.Deletecompany_DeleteNotification.as_view(),name="deletecompany_deletenotification"),
        path('deletecategory_deletenotification/',views.Deletecategory_DeleteNotification.as_view(),name="deletecategory_deletenotification"),
        path('deletesector_deletenotification/',views.Deletesector_DeleteNotification.as_view(),name="deletesector_deletenotification"),



        path('deletenotification/',views.DeleteNotification.as_view(),name="deletenotification"),
        path('notificationn_readed/',views.Notificationn_Readed.as_view(),name="notificationn_readed"),
        path('alljobcategory/',views.AllJobcategory.as_view(),name="alljobcategory"),








]
