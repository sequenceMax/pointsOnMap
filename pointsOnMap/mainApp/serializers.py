from rest_framework import serializers

from mainApp.models import Point, Icon


class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = ["title", "image"]


class PointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = ["id", "title", "description", "x", "y", "icon"]
