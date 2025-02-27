from django.urls import path
from .views import register_views, user_views, transaction_views, plaid_views, plaiditem_views

urlpatterns = [
    path('register/', register_views.RegisterView.as_view(), name='register'),

    path('users/', user_views.UserViewSet.as_view({
        'get': 'list'
    }), name='user-list'),

    path('users/<int:pk>/', user_views.UserViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='user-detail'),

    path('transactions/', transaction_views.TransactionViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='transaction-list'),

    path('transactions/<int:pk>/', transaction_views.TransactionViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='transaction-detail'),

    path('transactions/delete/', transaction_views.DeleteAllTransactionsView.as_view(), name='delete-all-transactions'),

    path('create_link_token/', plaid_views.create_link_token, name='create-link-token'),

    path('set_access_token/', plaid_views.set_access_token, name='set-access-token'),

    path('plaiditems/', plaiditem_views.PlaidItemViewSet.as_view({
        'get': 'list',
    }), name='plaid-item-list'),

    path('plaiditems/<int:pk>/', plaiditem_views.PlaidItemViewSet.as_view({
        'delete': 'destroy'
    }), name='plaid-item-detail'),

    path('plaidtransactions/', plaid_views.fetch_transactions, name='plaid-fetch-transactions'),

    path('transactions/user/', transaction_views.UserTransactionListView.as_view(), name='user-transactions'),

    path('plaidauth/', plaid_views.fetch_auth, name='plaid-fetch-auth'),

    path('plaidrecurringtransactions/', plaid_views.fetch_recurring_transactions, name='plaid-fetch-recurring-transactions'), 

    path('monthlysummary/user/', plaid_views.fetch_user_monthly_summary, name='user-monthly-summary'),


    # path('displaydash/', user_views.DisplayDashCreateView.as_view(), name='displaydash-list'),

    # path('displaydash/<int:pk>/', user_views.DiplayDashViewSet.as_view({
    #     'get': 'retrieve',
    #     'put': 'update',
    #     'patch': 'partial_update',
    #     'delete': 'destroy'
    # }), name='displaydash-detail'),
]
