from rest_framework import serializers

from mainApp.models import Point, Icon


class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = ["title", "image"]


class PointSerializer(serializers.ModelSerializer):
    # icon = serializers.SerializerMethodField()
    #
    # def get_icon(self, obj):
    #     return {
    #         'id': str(obj.icon.id),
    #         'title': obj.icon.title,
    #         'image': str(obj.icon.image)
    #     }

    class Meta:
        model = Point
        fields = ["title", "description", "x", "y", "icon"]


