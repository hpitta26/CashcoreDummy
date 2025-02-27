from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

# Transactions model 
class Transaction(models.Model):
    transactionID = models.AutoField(primary_key=True)
    accountID = models.CharField(max_length=255) # What account it came from
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=255) # ex: United Airlines, McDonald's, etc.
    amount = models.DecimalField(max_digits=10, decimal_places=2) # range: [-99,999,999.99, 99,999,999.99]
    categories = models.JSONField() # ex: ["Food and Drink", "Restaurants", "Fast Food"]
    personalFinanceCategory = models.CharField(max_length=255) # more specific category
 
    transactionDate = models.DateField() # Date the transaction was made

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-transactionDate']

    def __str__(self):
        return f"{self.companyName}, {self.userID}, {self.amount}"
    
    def formatted_date(self):
        # Returns date in format: 'Nov 16'
        return self.transactionDate.strftime("%b").capitalize() + self.transactionDate.strftime(" %d")
    

# PlaidItem model
class PlaidItem(models.Model):
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    institutionName = models.CharField(max_length=255, blank=True, null=True) # Example: Bank name
    accessToken = models.CharField(max_length=255, unique=True)
    itemID = models.CharField(max_length=255, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    monthlySummary = models.JSONField(default=list) # List of dictionaries with keys: 'year', 'month', 'income', 'expenses'
    # monthlyIncome = models.JSONField(default=list) 
    # monthlyTotalBalance = models.JSONField(default=list)

    def __str__(self):
        return f"Plaid Item for user {self.userID} - Item ID: {self.itemID}"
    

# class DisplayDash(models.Model):
#     display = models.CharField(max_length=255)

