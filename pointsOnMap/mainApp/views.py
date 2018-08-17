from django.shortcuts import render
from rest_framework import viewsets, permissions

from mainApp.models import Point, Icon
from mainApp.serializers import PointSerializer, IconSerializer


# import pdb;
# pdb.set_trace()


class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    permission_classes = [permissions.AllowAny]


class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
    permission_classes = [permissions.AllowAny]


def test(request):
    return render(request, 'mainApp/home.html')
