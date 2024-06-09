from django.urls import path
from . import views




urlpatterns=[
    path('register/',views.Registerview.as_view(),name="register"),
    path('login/',views.LoginView.as_view(),name="login"),
    path('users/', views.UsersView.as_view(), name="users"),


]