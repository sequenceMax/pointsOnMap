from collections import OrderedDict

from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

from mainApp.models import Point, Icon
from mainApp.serializers import PointSerializer, IconSerializer


class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = (filters.SearchFilter,)
    search_fields = ['description', 'title']


class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        title = self.request.query_params.get('title', None)
        if title:
            qs = qs.filter(title__icontains=title)
        return qs


def homePage(request):
    try:
        token = request.COOKIES['csrftoken']
        attr = OrderedDict([('token', token)])
        d = VerifyJSONWebTokenSerializer().validate(attr)
    except ValidationError as e:
        return render(request, '../../security_app/templates/security_app/index.html')
    except KeyError as e:
        return render(request, '../../security_app/templates/security_app/index.html')

    return render(request, 'mainApp/home.html', {'username': d['user'].username})
