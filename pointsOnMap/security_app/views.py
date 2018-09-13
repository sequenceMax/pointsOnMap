from collections import OrderedDict

from django.shortcuts import render
from rest_framework.exceptions import ValidationError
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer


def reg(request):
    token = request.COOKIES['csrftoken']
    attr = OrderedDict([('token', token)])
    try:
        VerifyJSONWebTokenSerializer().validate(attr)
    except ValidationError as e:
        return render(request, 'security_app/registration.html')

    return render(request, 'mainApp/home.html')
