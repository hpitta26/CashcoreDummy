from django.http import JsonResponse, Http404
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import date, timedelta
import os

import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
from plaid.model.country_code import CountryCode
from plaid.model.products import Products

from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions

from plaid.model.auth_get_request import AuthGetRequest

from plaid.model.transactions_recurring_get_request import TransactionsRecurringGetRequest
from plaid.model.transactions_recurring_get_request_options import TransactionsRecurringGetRequestOptions

from ..models import PlaidItem
from django.contrib.auth.models import User
from ..serializers import PlaidItemSerializer, TransactionSerializer
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view

# Plaid API Keys
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS').split(',')

configuration = Configuration(
    host = plaid.Environment.Sandbox,
    api_key = {"clientId": PLAID_CLIENT_ID, "secret": PLAID_SECRET}
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)


# Create Plaid link_token
@csrf_exempt
@require_POST
def create_link_token(request): # Can provide username or user_id
    try:
        data = json.loads(request.body)
        user = User.objects.get(username=data['username'])
        if not user:
            raise Http404("User does not exist")
        
        plaid_products = []
        for product in PLAID_PRODUCTS:
            plaid_products.append(Products(product))
        
        print(f"\n\n\nReached:\n{plaid_products}\n\n\n")

        link_token_create_request = LinkTokenCreateRequest(
            products=plaid_products,
            client_name="CashcoreDummy",
            country_codes=[CountryCode('US')],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(user.id)
            )
        )

        response = client.link_token_create(link_token_create_request)

        print(f"\n\n\n{response.to_dict()}\n\n\n")

        return JsonResponse({'link_token': response['link_token']})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# Set Plaid access_token
@csrf_exempt
@api_view(['POST'])
def set_access_token(request):
    try:
        data = json.loads(request.body)
        public_token = data['public_token']
        user = User.objects.get(username=data['username'])
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        metadata = data['metadata']
        
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        print(f"Exchange response: {exchange_response.to_dict()}")

        plaid_item = {
            "userID": user.id,
            "accessToken": access_token,
            "itemID": item_id,
            "institutionName": metadata['institution']['name']
        }
        # print(f"\n\n\n\n\nPlaid item: {plaid_item}\n\n\n\n\n")

        serializer = PlaidItemSerializer(data=plaid_item)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except plaid.ApiException as e:
        return Response({"error": "Plaid API error"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    

@api_view(['POST'])
def fetch_transactions(request):
    try:
        data = json.loads(request.body)
        if not data['username']:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(username=data['username'])
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            plaid_item = PlaidItem.objects.get(userID=user.id)
            access_token = plaid_item.accessToken
        except PlaidItem.DoesNotExist:
            return Response({'error': 'No access token found for the given Username'}, status=status.HTTP_404_NOT_FOUND)
        
        end_date = date.today()
        start_date = end_date - timedelta(days=90)

        transactions_request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date,
            options=TransactionsGetRequestOptions(
                count=25, # Will return up to n transactions
                offset=0, # Skip n 1st transactions
                include_personal_finance_category=True # Get Plaid's transaction categorization
            )
        )
        transactions_response = client.transactions_get(transactions_request).to_dict()

        # accounts = transactions_response['accounts']
        # item = transactions_response['item']
        # request_id = transactions_response['request_id']
        transactions = transactions_response['transactions']
        total_transactions = transactions_response['total_transactions']

        for t in transactions:
            transaction_data = {
                'accountID': t.get('account_id'),
                'userID': user.id,
                'companyName': t.get('merchant_name') or 'Unknown',
                'amount': t.get('amount', 0),
                'categories': t.get('category', []), # Or t.get('personal_finance_category', {}).get('primary', [])
                'personalFinanceCategory': t.get('personal_finance_category', {}).get('primary', 'Unknown'),
                'transactionDate': t.get('date') # Plaid doesn't provide minutes in for transaction_time
            }
            serializer = TransactionSerializer(data=transaction_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        # Get monthly Income and Expenses
        start_of_month = date.today().replace(day=1, month=date.today().month-1)
        monthly_expenses = 0
        monthly_income = 0
        for transaction in transactions:
            if transaction['amount'] > 0 and transaction['date'] >= start_of_month:
                monthly_expenses += transaction['amount']
            elif transaction['amount'] < 0 and transaction['date'] >= start_of_month:
                monthly_income += abs(transaction['amount'])
        monthly_expenses = round(monthly_expenses, 2)
        monthly_income = round(monthly_income, 2)

        # Update monthly expenses list in PlaidItem
        monthly_summary = plaid_item.monthlySummary
        current_month = {
            'year': start_of_month.year,
            'month': start_of_month.month,
            'expenses': monthly_expenses,
            'income': monthly_income
        }

        # Check if entry for current month already exists
        existing_entry = next((item for item in monthly_summary if 
                             item['year'] == current_month['year'] and 
                             item['month'] == current_month['month']), None)
        
        if existing_entry:
            existing_entry['expenses'] = current_month['expenses']
            existing_entry['income'] = current_month['income']
        else:
            monthly_summary.append(current_month)

        # Update the PlaidItem
        plaid_item.monthlySummary = monthly_summary
        plaid_item.save()
    

        return Response({'transactions': transactions, 'total_transactions': total_transactions, 'monthly_income': monthly_income, 'monthly_expenses': monthly_expenses}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['POST'])
def fetch_auth(request):
    try:
        data = json.loads(request.body)
        if not data['username']:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(username=data['username'])
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            plaid_item = PlaidItem.objects.get(userID=user.id)
            access_token = plaid_item.accessToken
        except PlaidItem.DoesNotExist:
            return Response({'error': 'No access token found for the given Username'}, status=status.HTTP_404_NOT_FOUND)
        
        auth_request = AuthGetRequest(access_token=access_token)
        auth_response = client.auth_get(auth_request).to_dict()

        return Response(auth_response, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def fetch_recurring_transactions(request):
    # Inflow_streams --> (recurring) deposits
    # Outflow_streams --> (recurring) expenses  

    try:
        data = json.loads(request.body)
        if not data['username']:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(username=data['username'])
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            plaid_item = PlaidItem.objects.get(userID=user.id)
            access_token = plaid_item.accessToken
        except PlaidItem.DoesNotExist:
            return Response({'error': 'No access token found for the given Username'}, status=status.HTTP_404_NOT_FOUND)
        
        recurring_request = TransactionsRecurringGetRequest(access_token=access_token)
        recurring_response = client.transactions_recurring_get(recurring_request).to_dict()

        return Response(recurring_response, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def fetch_user_monthly_summary(request):
    try:
        data = json.loads(request.body)
        if not data['username']:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(username=data['username'])
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            plaid_item = PlaidItem.objects.get(userID=user.id)
        except PlaidItem.DoesNotExist:
            return Response({'error': 'No access token found for the given Username'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get current month's summary
        current_month = date.today().month-1
        current_year = date.today().year
        
        monthly_summary = plaid_item.monthlySummary
        current_summary = None
        
        for summary in monthly_summary:
            if summary['month'] == current_month and summary['year'] == current_year:
                current_summary = summary
                break
                
        if not current_summary:
            return Response({'error': 'No summary found for current month'}, status=status.HTTP_404_NOT_FOUND)

        return Response(current_summary, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





        
        
