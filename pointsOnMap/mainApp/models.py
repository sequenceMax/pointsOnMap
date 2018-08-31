from django.db import models
from django.contrib.gis.db import models


class Icon(models.Model):
    title = models.TextField()
    image = models.ImageField(upload_to='mainApp/icons/', default='')

    def __str__(self):
        return self.title


class Point(models.Model):
    title = models.TextField(default='')
    description = models.TextField(default='')

#    location = models.PointField(srid=4326, null=True)

    x = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    y = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    icon = models.ForeignKey(Icon, on_delete=models.CASCADE)
    # is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
