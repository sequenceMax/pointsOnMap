
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

    def get_queryset(self):
        qs = super().get_queryset()
        description = self.request.query_params.get('description', None)
        if description:
            qs = qs.filter(description=description)
        return qs


class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        title = self.request.query_params.get('title', None)
        if title:
            qs = qs.filter(title=title)
        return qs


def test(request):
    return render(request, 'mainApp/home.html')

