from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from ..serializers import UserSerializer



# 8080/restapi/users/
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]




# class DiplayDashViewSet(viewsets.ModelViewSet):
#     queryset = DisplayDash.objects.all()
#     serializer_class = DisplayDashSerializer
#     permission_classes = [AllowAny]

# class DisplayDashCreateView(generics.CreateAPIView):
#     queryset = DisplayDash.objects.all()
#     serializer_class = DisplayDashSerializer
#     permission_classes = [AllowAny]  # Allow any user to register
