from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.common.utils import api_response
from apps.consultations.models import Consultation, ConsultationVitals
from apps.appointments.models import Appointment
from apps.notifications.utils import create_notification

from .models import Prescription
from .serializers import PrescriptionSerializer


class PrescriptionCreateView(APIView):
    permission_classes = [IsAuthenticated]

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

        serializer = PrescriptionSerializer(data=request.data)

        if serializer.is_valid():

            prescription = serializer.save(
                consultation=consultation
            )

            create_notification(
                user=consultation.patient.user,
                title="Prescription Added",
                message=f"Dr. {consultation.doctor.full_name} added a prescription."
            )

            return api_response(
                success=True,
                data=PrescriptionSerializer(prescription).data,
                status=status.HTTP_201_CREATED
            )

        return api_response(
            success=False,
            error=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class PrescriptionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, consultation_id):

        try:
            consultation = Consultation.objects.get(pk=consultation_id)

        except Consultation.DoesNotExist:
            return api_response(
                success=False,
                error="Consultation not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if (
            request.user.role == 'DOCTOR'
            and consultation.doctor.user != request.user
        ):
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        if (
            request.user.role == 'PATIENT'
            and consultation.patient.user != request.user
        ):
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        prescriptions = Prescription.objects.filter(
            consultation=consultation
        ).order_by('-created_at')

        serializer = PrescriptionSerializer(
            prescriptions,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )


class PrescriptionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            prescription = Prescription.objects.get(pk=pk)

        except Prescription.DoesNotExist:
            return api_response(
                success=False,
                error="Prescription not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if prescription.consultation.doctor.user != request.user:
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        prescription.delete()

        return api_response(
            success=True,
            data={
                "message": "Prescription deleted successfully"
            }
        )


class PrescriptionUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            prescription = Prescription.objects.get(pk=pk)

        except Prescription.DoesNotExist:
            return api_response(
                success=False,
                error="Prescription not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if prescription.consultation.doctor.user != request.user:
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        allowed_fields = [
            'medicine_name',
            'dosage',
            'frequency',
            'duration',
            'instructions'
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(prescription, field, request.data[field])

        prescription.save()

        serializer = PrescriptionSerializer(prescription)

        return api_response(
            success=True,
            data=serializer.data
        )

class PrescriptionPatientHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_name):
        # Optionally exclude the current appointment's consultation
        exclude_appointment_id = request.query_params.get('exclude_appointment')

        consultations = Consultation.objects.filter(
            patient__full_name__iexact=patient_name
        ).prefetch_related('prescriptions').order_by('-created_at')

        # Exclude the current appointment's consultation so doctor doesn't see current visit in history
        if exclude_appointment_id:
            consultations = consultations.exclude(appointment_id=exclude_appointment_id)

        history_data = []
        for c in consultations:
            medicines = []
            for p in c.prescriptions.all():
                medicines.append({
                    "medicine_name": p.medicine_name,
                    "dosage": p.dosage,
                    "frequency": p.frequency,
                    "duration": p.duration,
                    "instructions": p.instructions
                })
            
            vitals_data = None
            v = getattr(c, 'vitals', None)
            if v and (v.blood_pressure or v.pulse_rate or v.temperature or v.oxygen_saturation):
                vitals_data = {
                    "blood_pressure": v.blood_pressure or "N/A",
                    "pulse_rate": v.pulse_rate or "N/A",
                    "temperature": v.temperature or "N/A",
                    "oxygen_saturation": v.oxygen_saturation or "N/A"
                }

            if c.diagnosis or medicines or vitals_data:
                history_data.append({
                    "id": str(c.id),
                    "created_at": c.created_at.isoformat(),
                    "diagnosis": c.diagnosis or "",
                    "notes": c.doctor_notes or "",
                    "vitals": vitals_data,
                    "medicines": medicines
                })
        
        return api_response(success=True, data=history_data)


class PrescriptionSaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'DOCTOR':
            return api_response(success=False, error="Doctor access required", status=status.HTTP_403_FORBIDDEN)
            
        data = request.data
        appointment_id = data.get('appointment_id')
        
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
            consultation, _ = Consultation.objects.get_or_create(
                appointment=appointment,
                defaults={'doctor': appointment.doctor, 'patient': appointment.patient}
            )
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=404)
            
        if consultation.doctor.user != request.user:
            return api_response(success=False, error="Unauthorized", status=status.HTTP_403_FORBIDDEN)
        
        # Save vitals if provided
        vitals_data = data.get('vitals')
        if vitals_data:
            vitals, _ = ConsultationVitals.objects.get_or_create(consultation=consultation)
            if vitals_data.get('blood_pressure') is not None:
                vitals.blood_pressure = vitals_data.get('blood_pressure')
            if vitals_data.get('pulse_rate') is not None:
                vitals.pulse_rate = vitals_data.get('pulse_rate')
            if vitals_data.get('temperature') is not None:
                vitals.temperature = vitals_data.get('temperature')
            if vitals_data.get('oxygen_saturation') is not None:
                vitals.oxygen_saturation = vitals_data.get('oxygen_saturation')
            if vitals_data.get('weight') is not None:
                vitals.weight = vitals_data.get('weight')
            if vitals_data.get('height') is not None:
                vitals.height = vitals_data.get('height')
            vitals.save()
            
        # Save diagnosis and notes
        consultation.diagnosis = data.get('diagnosis', consultation.diagnosis)
        consultation.doctor_notes = data.get('notes', consultation.doctor_notes)
        consultation.save()
        
        # Save medicines (replace all for this consultation)
        medicines = data.get('medicines', [])
        consultation.prescriptions.all().delete()
        
        for med in medicines:
            if med.get('medicine_name'):
                Prescription.objects.create(
                    consultation=consultation,
                    medicine_name=med.get('medicine_name'),
                    dosage=med.get('dosage'),
                    frequency=med.get('frequency'),
                    duration=med.get('duration'),
                    instructions=med.get('instructions', '')
                )
                
        create_notification(
            user=consultation.patient.user,
            title="Prescription Added",
            message=f"Dr. {consultation.doctor.full_name} added a prescription."
        )

        return api_response(success=True, data="Prescription saved successfully")