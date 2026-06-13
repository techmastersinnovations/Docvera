from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.common.utils import api_response
from apps.appointments.models import Appointment
from .models import Review
from .serializers import ReviewSerializer

class ReviewCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'PATIENT':
            return api_response(
                success=False, 
                error="Only patients can write reviews", 
                status=status.HTTP_403_FORBIDDEN
            )

        appointment_id = request.data.get('appointment_id')
        rating = request.data.get('rating')
        comment = request.data.get('comment')

        if not all([appointment_id, rating, comment]):
            return api_response(
                success=False, 
                error="Missing required parameters", 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            appointment = Appointment.objects.get(pk=appointment_id)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=status.HTTP_404_NOT_FOUND)

        # Enforce that reviews can only be generated for completed bookings by the correct patient
        if appointment.patient.user != request.user:
            return api_response(
                success=False, 
                error="Unauthorized to submit reviews for this session", 
                status=status.HTTP_403_FORBIDDEN
            )
            
        if appointment.status != 'COMPLETED':
            return api_response(
                success=False, 
                error="Reviews can only be written for completed sessions", 
                status=status.HTTP_400_BAD_REQUEST
            )

        if Review.objects.filter(appointment=appointment).exists():
            return api_response(
                success=False, 
                error="Feedback review already exists for this appointment", 
                status=status.HTTP_400_BAD_REQUEST
            )

        review = Review.objects.create(
            appointment=appointment,
            patient=appointment.patient,
            doctor=appointment.doctor,
            rating=rating,
            comment=comment
        )

        serializer = ReviewSerializer(review)
        return api_response(success=True, data=serializer.data, status=status.HTTP_201_CREATED)
