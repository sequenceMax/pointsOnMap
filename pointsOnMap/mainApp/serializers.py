from rest_framework import serializers
from rest_framework_gis.serializers import GeoModelSerializer

from mainApp.models import Point, Icon


class IconSerializer(serializers.ModelSerializer):

    class Meta:
        model = Icon
        fields = ["title", "image"]


class PointSerializer(GeoModelSerializer):

    def validate_location(self, value):
        if((value.coords[0] > 180) | (value.coords[1] > 86) | (value.coords[0] < -180) |
                (value.coords[0] < -86)):
            raise serializers.ValidationError('Uncorrect coordinates')
        else:
            return value

    class Meta:
        model = Point
        geo_field = 'location'
        fields = ["id", "title", "description", "location", "icon"]
