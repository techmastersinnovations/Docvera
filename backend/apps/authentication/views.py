from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .serializers import PatientRegisterSerializer, DoctorRegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.doctors.models import Doctor
from apps.patients.models import Patient
from apps.common.utils import api_response

class PatientRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PatientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True, 
                data={"message": "Patient registered successfully"}, 
                status=status.HTTP_201_CREATED
            )
        return api_response(success=False, error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DoctorRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = DoctorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True, 
                data={"message": "Doctor profile registered and is pending approval"}, 
                status=status.HTTP_201_CREATED
            )
        return api_response(success=False, error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            return api_response(success=True, data=serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            raise e
User = get_user_model()

class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN':
            return api_response(success=False, error="Admin access required", status=status.HTTP_403_FORBIDDEN)

        total_users = User.objects.count()
        total_doctors = Doctor.objects.count()
        total_patients = Patient.objects.count()
        pending_doctors = Doctor.objects.filter(approval_status='PENDING_APPROVAL').count()

        # Calculate total platform revenue (sum of all captured payments)
        # Note: You might want to optimize this with aggregation in production
        from apps.payments.models import Payment
        total_revenue = Payment.objects.filter(status='CAPTURED').aggregate(total=models.Sum('amount'))['total'] or 0

        return api_response(success=True, data={
            "total_users": total_users,
            "total_doctors": total_doctors,
            "total_patients": total_patients,
            "pending_doctors": pending_doctors,
            "total_revenue": float(total_revenue)
        })