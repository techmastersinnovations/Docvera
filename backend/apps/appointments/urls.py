from django.urls import path
from .views import (
    BookingCreateView,
    BookingRescheduleView,
    BookingCancelView,
    PatientDashboardAppointmentsView,
    DoctorDashboardAppointmentsView,
    RazorpayVerificationView,
    SlotAvailabilityView,
    AppointmentStatusUpdateView
)

urlpatterns = [
    path('book/', BookingCreateView.as_view(), name='appointment_book'),
    path('reschedule/<uuid:pk>/', BookingRescheduleView.as_view(), name='appointment_reschedule'),
    path('cancel/<uuid:pk>/', BookingCancelView.as_view(), name='appointment_cancel'),
    path('dashboard/patient/', PatientDashboardAppointmentsView.as_view(), name='appointment_patient_dashboard'),
    path('dashboard/doctor/', DoctorDashboardAppointmentsView.as_view(), name='appointment_doctor_dashboard'),
    path('verify-payment/', RazorpayVerificationView.as_view(), name='verify_payment'),
    path('slots/availability/', SlotAvailabilityView.as_view(), name='slot_availability'),
    path('<uuid:pk>/status/', AppointmentStatusUpdateView.as_view(), name='appointment_status_update'),
]