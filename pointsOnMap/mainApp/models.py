from django.db import models


class Icon(models.Model):
    title = models.TextField()
    path = models.TextField()
    image = models.ImageField(upload_to='icons/', default='')

    def __str__(self):
        return self.title


class Point(models.Model):
    title = models.TextField()
    description = models.TextField()
    x = models.DecimalField(max_digits=10, decimal_places=6)
    y = models.DecimalField(max_digits=10, decimal_places=6)
    icon = models.ForeignKey(Icon, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
