from django.urls import path
from .views import DoctorSearchView, DoctorAvailabilityManageView, DoctorApprovalActionView, PendingDoctorsListView, \
    DoctorProfileUpdateView

urlpatterns = [
    path('search/', DoctorSearchView.as_view(), name='doctor_search'),
    path('availability/', DoctorAvailabilityManageView.as_view(), name='doctor_availability_manage'),
    path('pending/', PendingDoctorsListView.as_view(), name='doctor_pending_list'),
    path('approval/<uuid:pk>/', DoctorApprovalActionView.as_view(), name='doctor_approval_action'),
    path('profile/update/', DoctorProfileUpdateView.as_view(), name='doctor_profile_update'),
]
