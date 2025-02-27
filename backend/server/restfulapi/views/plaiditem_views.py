from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import PlaidItem
from ..serializers import PlaidItemSerializer


class PlaidItemViewSet(viewsets.ModelViewSet):
    queryset = PlaidItem.objects.all()
    serializer_class = PlaidItemSerializer
    permission_classes = [AllowAny]