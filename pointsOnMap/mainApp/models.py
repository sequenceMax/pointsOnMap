from django.db import models


class Icon(models.Model):
    title = models.TextField()
    path = models.TextField()

    def __str__(self):
        return "%s" % self.title


class Point(models.Model):
    title = models.TextField()
    description = models.TextField()
    x = models.DecimalField(max_digits=10, decimal_places=6)
    y = models.DecimalField(max_digits=10, decimal_places=6)
    icon = models.ForeignKey(Icon, on_delete=models.CASCADE)

    def __str__(self):
        return "%s" % self.title
