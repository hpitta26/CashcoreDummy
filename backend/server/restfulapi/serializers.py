from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, PlaidItem

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'last_login', 'date_joined', 'is_superuser']

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, oldUser, validated_data):
        oldUser.username = validated_data.get('username', oldUser.username) #Tries to get 'username' in dict, if not there (default==oldUser.username)
        oldUser.email = validated_data.get('email', oldUser.email)
        oldUser.first_name = validated_data.get('first_name', oldUser.first_name)
        oldUser.last_name = validated_data.get('last_name', oldUser.last_name)

        password = validated_data.get('password', None)
        if password:
            oldUser.set_password(password)  # Hash the new password if provided

        oldUser.save()
        return oldUser
    
# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'

# Plaid Item Serializer
class PlaidItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaidItem
        fields = '__all__'


# class DisplayDashSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DisplayDash
#         fields = '__all__'