from django.shortcuts import render
from rest_framework import viewsets
from mainApp.models import Point, Icon
from mainApp.serializers import PointSerializer, IconSerializer
from .forms import FormForAddPoint


def home(request):
    # import pdb;
    # pdb.set_trace()
    form = FormForAddPoint(request.POST or None)
    point_list = Point.objects.order_by('title')

    return render(request, 'mainApp/home.html', locals())


class PointViewSet(viewsets.ModelViewSet):
        queryset = Point.objects.all()
        serializer_class = PointSerializer


class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer


