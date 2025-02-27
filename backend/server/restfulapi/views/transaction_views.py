from rest_framework import viewsets, generics
from rest_framework.response import Response
from ..serializers import TransactionSerializer
from ..models import Transaction
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]


class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        user_name = request.data.get('username')
        if not user_name:
            return Response({"error": "username is required"}, status=400)
        
        try:
            user = User.objects.get(username=user_name)
            transactions = Transaction.objects.filter(userID=user.id)
            serializer = TransactionSerializer(transactions, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class DeleteAllTransactionsView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        Transaction.objects.all().delete()
        return Response({"message": "All transactions have been deleted."}, status=status.HTTP_204_NO_CONTENT)

