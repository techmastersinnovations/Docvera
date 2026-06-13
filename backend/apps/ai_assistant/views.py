from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.common.utils import api_response
from apps.doctors.models import Doctor
from apps.patients.models import Patient

from .models import AIInteraction
from .serializers import AIInteractionSerializer
from .services import generate_ai_medical_suggestion


class AIMedicalSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, patient_id):

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

        try:
            patient = Patient.objects.get(pk=patient_id)

        except Patient.DoesNotExist:
            return api_response(
                success=False,
                error="Patient not found",
                status=status.HTTP_404_NOT_FOUND
            )

        symptoms = request.data.get('symptoms')

        if not symptoms:
            return api_response(
                success=False,
                error="Symptoms are required",
                status=status.HTTP_400_BAD_REQUEST
            )

        ai_response = generate_ai_medical_suggestion(
            symptoms
        )

        interaction = AIInteraction.objects.create(
            doctor=doctor,
            patient=patient,
            symptoms=symptoms,
            ai_response=ai_response
        )

        serializer = AIInteractionSerializer(
            interaction
        )

        return api_response(
            success=True,
            data=serializer.data,
            status=status.HTTP_201_CREATED
        )


class AIInteractionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        interactions = AIInteraction.objects.filter(
            doctor__user=request.user
        ).order_by('-created_at')

        serializer = AIInteractionSerializer(
            interactions,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )