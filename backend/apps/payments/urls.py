from django.urls import path
from .views import RazorpayPaymentVerifyView

urlpatterns = [
    path('verify/', RazorpayPaymentVerifyView.as_view(), name='payment_verify'),
]
