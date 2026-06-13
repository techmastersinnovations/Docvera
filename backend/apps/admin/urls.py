from django.urls import path
from .views import (
    DoctorManagementView,
    DoctorActionView,
    PayoutManagementView,
    SystemSettingsView
)

urlpatterns = [
    # Doctor Management & Actions
    path('doctors/', DoctorManagementView.as_view(), name='admin_doctors'),
    path('doctors/<uuid:doctor_id>/action/', DoctorActionView.as_view(), name='admin_doctor_action'),

    # Financial Engine
    path('payouts/', PayoutManagementView.as_view(), name='admin_payout_list'),
    path('payouts/<uuid:payout_id>/', PayoutManagementView.as_view(), name='admin_payout_process'),

    # Global Config
    path('settings/', SystemSettingsView.as_view(), name='admin_settings'),
]