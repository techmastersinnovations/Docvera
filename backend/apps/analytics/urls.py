from django.urls import path
from .views import DoctorDashboardAnalyticsView

urlpatterns = [
    path(
        'doctor/dashboard/',
        DoctorDashboardAnalyticsView.as_view(),
        name='doctor_dashboard_analytics'
    ),
]