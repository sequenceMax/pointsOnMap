from django.conf.urls import url
from django.urls import include, path
from rest_framework import routers

from mainApp import views

router = routers.DefaultRouter()
router.register('icons', views.IconViewSet, base_name='iconRouter')
router.register('points', views.PointViewSet, base_name='pointRouter')


urlpatterns = [
    path('api/', include(router.urls)),
    url('', views.test),
]


