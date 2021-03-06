from django.contrib import admin
from mainApp.models import Point, Icon


class PointAdmin(admin.ModelAdmin):
    list_display = ["title", "icon", "location"]
    search_fields = ["title"]

    class Meta:
        model = Point


class IconAdmin(admin.ModelAdmin):
    list_display = ["title"]
    search_fields = ["title"]

    class Meta:
        model = Icon


admin.site.register(Point, PointAdmin)
admin.site.register(Icon, IconAdmin)