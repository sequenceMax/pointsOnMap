from django.conf.urls import url
from django.urls import path, include
from django.views.generic import ListView, DetailView
from rest_framework import routers

from mainApp import views
from mainApp.models import Point

router = routers.DefaultRouter()
router.register(r'points', views.PointViewSet, base_name='pointRouter')

urlpatterns = [
    url('', include(router.urls)),
]
