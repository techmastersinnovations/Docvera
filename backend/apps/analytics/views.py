from decimal import Decimal
from django.db.models import Count, Sum
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.common.utils import api_response
from apps.appointments.models import Appointment
from apps.consultations.models import Consultation
from apps.payments.models import Payment
from apps.doctors.models import Doctor


class DoctorDashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return api_response(
                success=False,
                error="Doctor profile not found",
                status=status.HTTP_404_NOT_FOUND
            )

        today = timezone.localdate()

        appointments = Appointment.objects.filter(
            doctor=doctor
        )

        total_appointments = appointments.count()

        today_appointments = appointments.filter(
            booking_date=today
        ).count()

        completed_appointments = appointments.filter(
            status='COMPLETED'
        ).count()

        pending_appointments = appointments.filter(
            status='PENDING'
        ).count()

        cancelled_appointments = appointments.filter(
            status='CANCELLED'
        ).count()

        confirmed_appointments = appointments.filter(
            status='CONFIRMED'
        ).count()

        total_consultations = Consultation.objects.filter(
            doctor=doctor
        ).count()

        completed_consultations = Consultation.objects.filter(
            doctor=doctor,
            status='COMPLETED'
        ).count()

        payments = Payment.objects.filter(
            appointment__doctor=doctor,
            status='CAPTURED'
        )

        total_revenue = payments.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        monthly_revenue = payments.filter(
            created_at__month=today.month,
            created_at__year=today.year
        ).aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        data = {
            "appointments": {
                "total": total_appointments,
                "today": today_appointments,
                "completed": completed_appointments,
                "pending": pending_appointments,
                "confirmed": confirmed_appointments,
                "cancelled": cancelled_appointments
            },

            "consultations": {
                "total": total_consultations,
                "completed": completed_consultations
            },

            "revenue": {
                "total_revenue": total_revenue,
                "monthly_revenue": monthly_revenue
            }
        }

        return api_response(
            success=True,
            data=data
        )