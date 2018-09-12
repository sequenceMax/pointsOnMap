from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers

from mainApp import views

router = routers.DefaultRouter()
router.register('icons', views.IconViewSet, base_name='iconRouter')
router.register('points', views.PointViewSet, base_name='pointRouter')

urlpatterns = [
                  path('api/', include(router.urls)),
                  url(r'^$', views.homePage),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
