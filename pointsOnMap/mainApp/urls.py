from django.urls import path
from django.views.generic import ListView, DetailView
from mainApp.models import Point


urlpatterns = [
    path('', ListView.as_view(queryset=Point.objects.all().order_by("title"),
                              template_name="mainApp/home.html")),
    path('article/<int:pk>',
         DetailView.as_view(model=Point, template_name="mainApp/article.html")),
]
