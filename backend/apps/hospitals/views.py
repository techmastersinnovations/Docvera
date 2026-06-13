from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from apps.common.utils import api_response
# CORRECT IMPORTS: Doctor is in doctors app, DoctorHospital is in hospitals app
from apps.doctors.models import Doctor
from apps.hospitals.models import Hospital, DoctorHospital
from apps.doctors.serializers import DoctorSerializer
from .models import Hospital
from .serializers import HospitalSerializer


class HospitalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        city = request.query_params.get('city')
        pin_code = request.query_params.get('pin_code')
        name = request.query_params.get('name')

        queryset = Hospital.objects.all()

        if name:
            queryset = queryset.filter(name__icontains=name)
        if city:
            queryset = queryset.filter(city__iexact=city)
        if pin_code:
            queryset = queryset.filter(pin_code=pin_code)

        serializer = HospitalSerializer(queryset, many=True)
        return api_response(success=True, data=serializer.data)


class HospitalDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            hospital = Hospital.objects.get(pk=pk)
        except Hospital.DoesNotExist:
            return api_response(success=False, error="Hospital not found", status=status.HTTP_404_NOT_FOUND)

        # Fetch all doctors affiliated with this hospital
        doc_hosp_relations = DoctorHospital.objects.filter(hospital=hospital).select_related('doctor')
        doctors = [rel.doctor for rel in doc_hosp_relations if rel.doctor.approval_status == 'APPROVED']

        serializer = DoctorSerializer(doctors, many=True)

        return api_response(success=True, data={
            "hospital": HospitalSerializer(hospital).data,
            "doctors": serializer.data
        })


class HospitalCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'ADMIN':
            return api_response(
                success=False,
                error="Admin privileges required to registers hospitals",
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = HospitalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(success=True, data=serializer.data, status=status.HTTP_201_CREATED)
        return api_response(success=False, error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)