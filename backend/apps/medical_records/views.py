from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from apps.common.utils import api_response
from apps.consultations.models import Consultation
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer


class MedicalRecordUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, consultation_id):
        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            consultation = Consultation.objects.get(pk=consultation_id)
        except Consultation.DoesNotExist:
            return api_response(
                success=False,
                error="Consultation not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if consultation.doctor.user != request.user:
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MedicalRecordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                patient=consultation.patient,
                doctor=consultation.doctor,
                consultation=consultation
            )

            return api_response(
                success=True,
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )

        return api_response(
            success=False,
            error=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class PatientMedicalHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'PATIENT':
            return api_response(
                success=False,
                error="Patient access required",
                status=status.HTTP_403_FORBIDDEN
            )

        records = MedicalRecord.objects.filter(
            patient__user=request.user
        ).order_by('-uploaded_at')

        serializer = MedicalRecordSerializer(
            records,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )


class DoctorPatientMedicalHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        records = MedicalRecord.objects.filter(
            patient_id=patient_id
        ).order_by('-uploaded_at')

        serializer = MedicalRecordSerializer(
            records,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )