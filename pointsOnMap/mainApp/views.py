from collections import OrderedDict

from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

from mainApp.models import Point, Icon
from mainApp.serializers import PointSerializer, IconSerializer


# import pdb;
# pdb.set_trace()

class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    permission_classes = [permissions.AllowAny]

    # filter_backends = (DjangoFilterBackend,)
    # filter_fields = ['description', 'title']

    def list(self, request, *args, **kwargs):
        queryset = Point.objects.all()
        description = self.request.query_params.get('description', None)
        if description:
            queryset = queryset.filter(description__icontains=description)
        serializer = PointSerializer(queryset, many=True)
        return Response(serializer.data)


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
    token = request.COOKIES['csrftoken']
    attr = OrderedDict([('token', token)])
    try:
        VerifyJSONWebTokenSerializer().validate(attr)
    except ValidationError as e:
        print(e.detail[0])
        return render(request, '../../security_app/templates/security_app/index.html')

    return render(request, 'mainApp/home.html')
