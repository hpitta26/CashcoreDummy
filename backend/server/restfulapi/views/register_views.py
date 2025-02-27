from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from ..serializers import UserSerializer

# 8080/restapi/register/
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to register
    