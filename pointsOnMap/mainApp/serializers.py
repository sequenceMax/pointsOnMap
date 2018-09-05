import re

from django.contrib.gis.db.models import PointField
from rest_framework import serializers
from rest_framework_gis.serializers import GeoModelSerializer

from mainApp.models import Point, Icon


class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = ["title", "image"]


class PointSerializer(GeoModelSerializer):

    def validate_location(self, value):
        if((value.coords[0] > 300) | (value.coords[1] > 90) | (value.coords[0] < -300) |
                (value.coords[0] < -90)):
            raise serializers.ValidationError('Uncorrect coordinates')
        else:
            return value

    class Meta:
        model = Point
        geo_field = 'location'
        fields = ["id", "title", "description", "location", "icon"]
