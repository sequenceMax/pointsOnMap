from django.urls import path, include

from security_app import views

urlpatterns = [
                  path('registration/', views.reg),
]