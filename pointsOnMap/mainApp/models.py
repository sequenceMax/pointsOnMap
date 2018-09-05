from django.db import models
from django.contrib.gis.db import models


class User(models.Model):
    login = models.TextField(default='')
    name = models.TextField(default='')


class Icon(models.Model):
    title = models.TextField()
    image = models.ImageField(upload_to='mainApp/icons/', default='')

    def __str__(self):
        return self.title


class Point(models.Model):
    title = models.TextField(default='')
    description = models.TextField(default='')
    location = models.PointField(srid=4326, null=True)
    icon = models.ForeignKey(Icon, on_delete=models.CASCADE)
    # user_create = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
