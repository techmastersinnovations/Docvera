from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from apps.common.utils import api_response
from .models import Patient
from .serializers import PatientProfileSerializer


class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            patient = request.user.patient_profile
            serializer = PatientProfileSerializer(patient)
            return api_response(success=True, data=serializer.data)
        except Patient.DoesNotExist:
            return api_response(
                success=False,
                error="Patient profile not found",
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            patient = request.user.patient_profile

            # FIX: Explicitly bind request.FILES along with request.data for MultiPart file streams
            serializer = PatientProfileSerializer(
                patient,
                data=request.data,
                files=request.FILES,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return api_response(success=True, data=serializer.data, message="Profile updated successfully")
            return api_response(success=False, error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Patient.DoesNotExist:
            return api_response(
                success=False,
                error="Patient profile not found",
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request):
        try:
            patient = request.user.patient_profile

            # FIX: Explicitly bind request.FILES along with request.data here as well
            serializer = PatientProfileSerializer(
                patient,
                data=request.data,
                files=request.FILES,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return api_response(success=True, data=serializer.data, message="Profile updated successfully")
            return api_response(success=False, error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Patient.DoesNotExist:
            return api_response(
                success=False,
                error="Patient profile not found",
                status=status.HTTP_404_NOT_FOUND
            )


class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            patient = request.user.patient_profile
            serializer = PatientProfileSerializer(patient)
            return api_response(success=True, data=serializer.data)
        except Patient.DoesNotExist:
            return api_response(
                success=False,
                error="Patient profile not found",
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            patient = request.user.patient_profile
            data = request.data

            # Directly update model fields to bypass MultiPart serialization constraints
            patient.full_name = data.get('full_name', patient.full_name)
            patient.gender = data.get('gender', patient.gender)
            patient.city = data.get('city', patient.city)
            patient.pin_code = data.get('pin_code', patient.pin_code)
            patient.address = data.get('address', patient.address)

            # Handle nullable types explicitly
            if 'blood_group' in data:
                patient.blood_group = data.get('blood_group')
            if 'emergency_contact' in data:
                patient.emergency_contact = data.get('emergency_contact')

            # Extract binary file safely from the files dictionary stream
            if 'profile_photo' in request.FILES:
                patient.profile_photo = request.FILES['profile_photo']

            patient.save()

            # Return fresh serialized data to the frontend state engine without 'message' parameter
            serializer = PatientProfileSerializer(patient)
            return api_response(
                success=True,
                data=serializer.data
            )

        except Patient.DoesNotExist:
            return api_response(
                success=False,
                error="Patient profile not found",
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return api_response(
                success=False,
                error=str(e),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        # Forward directly to the clean direct field updater method
        return self.put(request)