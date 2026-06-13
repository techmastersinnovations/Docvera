from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.db.models import F, FloatField, ExpressionWrapper
from django.db.models.functions import ACos, Cos, Radians, Sin
from django.core.mail import send_mail
from django.conf import settings

from apps.common.utils import api_response
from apps.hospitals.models import Hospital
from .models import Doctor, DoctorAvailability
from .serializers import DoctorSerializer, DoctorAvailabilitySerializer

class DoctorSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        specialization = request.query_params.get('specialization')
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        pin_code = request.query_params.get('pin_code')
        city = request.query_params.get('city')

        queryset = Doctor.objects.filter(approval_status='APPROVED')

        if specialization:
            queryset = queryset.filter(specialization=specialization)

        # Priority 1: Browser Coordinates Search
        if lat and lng:
            try:
                lat_val = float(lat)
                lng_val = float(lng)
                
                rad_lat = Radians(lat_val)
                rad_lng = Radians(lng_val)
                
                # Filter hospitals in 30km radius
                nearby_hospitals = Hospital.objects.annotate(
                    distance=ExpressionWrapper(
                        6371 * ACos(
                            Cos(rad_lat) * Cos(Radians(F('latitude'))) * 
                            Cos(Radians(F('longitude')) - rad_lng) + 
                            Sin(rad_lat) * Sin(Radians(F('latitude')))
                        ),
                        output_field=FloatField()
                    )
                ).filter(distance__lte=30).order_by('distance')
                
                hospital_ids = nearby_hospitals.values_list('id', flat=True)
                if hospital_ids.exists():
                    queryset = queryset.filter(hospital_affiliations__hospital_id__in=hospital_ids).distinct()
            except ValueError:
                pass

        # Priority 2: Fallback to PIN Code if queryset is empty or coordinates not specified
        if pin_code and (not lat or not lng or not queryset.exists()):
            queryset = queryset.filter(pin_code=pin_code)

        # Priority 3: Fallback to City if PIN fails or is omitted
        if city and (not pin_code or not queryset.exists()) and (not lat or not lng or not queryset.exists()):
            queryset = queryset.filter(city__iexact=city)

        serializer = DoctorSerializer(queryset, many=True)
        return api_response(success=True, data=serializer.data)

class DoctorAvailabilityManageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'DOCTOR':
            return api_response(
                success=False, 
                error="Only doctor users can configure schedules", 
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            doctor = request.user.doctor_profile
        except Doctor.DoesNotExist:
            return api_response(
                success=False, 
                error="Doctor profile not initialized", 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DoctorAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=doctor)
            return api_response(
                success=True, 
                data=serializer.data, 
                status=status.HTTP_201_CREATED
            )
        return api_response(success=False, error=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DoctorApprovalActionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        if request.user.role != 'ADMIN':
            return api_response(
                success=False, 
                error="Only administrators can manage approval workflows", 
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            doctor = Doctor.objects.get(pk=pk)
        except Doctor.DoesNotExist:
            return api_response(
                success=False, 
                error="Doctor profile not found", 
                status=status.HTTP_404_NOT_FOUND
            )
            
        action = request.data.get('action')
        rejection_reason = request.data.get('rejection_reason')
        
        if action == 'APPROVE':
            doctor.approval_status = 'APPROVED'
            doctor.rejection_reason = None
            doctor.save()
            
            try:
                send_mail(
                    subject="Doctor Account Approved - Docvera",
                    message=f"Dear Dr. {doctor.full_name}, your account application has been APPROVED. You can now access your provider dashboard.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[doctor.user.email, 'techmasterstrainings@gmail.com'],
                    fail_silently=True
                )
            except Exception:
                pass
                
            return api_response(success=True, data={"message": "Doctor profile approved successfully"})
            
        elif action == 'REJECT':
            if not rejection_reason:
                return api_response(
                    success=False, 
                    error="Rejection reason is required", 
                    status=status.HTTP_400_BAD_REQUEST
                )
            doctor.approval_status = 'REJECTED'
            doctor.rejection_reason = rejection_reason
            doctor.save()
            
            try:
                send_mail(
                    subject="Doctor Account Application Status Update - Docvera",
                    message=f"Dear Dr. {doctor.full_name}, your application was not approved. Reason: {rejection_reason}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[doctor.user.email, 'techmasterstrainings@gmail.com'],
                    fail_silently=True
                )
            except Exception:
                pass
                
            return api_response(success=True, data={"message": "Doctor profile rejected successfully"})
            
        return api_response(
            success=False, 
            error="Invalid action. Choose APPROVED or REJECTED", 
            status=status.HTTP_400_BAD_REQUEST
        )


# apps/doctors/views.py
class DoctorProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.role != 'DOCTOR':
            return api_response(success=False, error="Doctor access required", status=status.HTTP_403_FORBIDDEN)

        try:
            doctor = request.user.doctor_profile
        except Doctor.DoesNotExist:
            return api_response(success=False, error="Profile not found", status=status.HTTP_404_NOT_FOUND)

        # Allow updating specific fields
        allowed_fields = [
            'clinic_name', 'clinic_address', 'clinic_city', 'clinic_pin_code',
            'consultation_fees', 'about', 'languages_spoken'
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(doctor, field, request.data[field])

        doctor.save()
        serializer = DoctorSerializer(doctor)
        return api_response(success=True, data=serializer.data)

class PendingDoctorsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN':
            return api_response(
                success=False,
                error="Administrator access required",
                status=status.HTTP_403_FORBIDDEN
            )
        pending = Doctor.objects.filter(approval_status='PENDING_APPROVAL')
        serializer = DoctorSerializer(pending, many=True)
        return api_response(success=True, data=serializer.data)
