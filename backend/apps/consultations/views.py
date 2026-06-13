from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.common.utils import api_response
from apps.appointments.models import Appointment
from apps.notifications.utils import create_notification

from .models import Consultation, ConsultationVitals
from .serializers import ConsultationSerializer, ConsultationVitalsSerializer
from apps.chats.models import Conversation, Message


class ConsultationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            appointment = Appointment.objects.get(pk=appointment_id)

        except Appointment.DoesNotExist:
            return api_response(
                success=False,
                error="Appointment not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if appointment.doctor.user != request.user:
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        if hasattr(appointment, 'consultation'):
            return api_response(
                success=False,
                error="Consultation already exists",
                status=status.HTTP_400_BAD_REQUEST
            )

        consultation = Consultation.objects.create(
            appointment=appointment,
            doctor=appointment.doctor,
            patient=appointment.patient,
            symptoms=request.data.get('symptoms'),
            diagnosis=request.data.get('diagnosis'),
            doctor_notes=request.data.get('doctor_notes'),
            follow_up_required=request.data.get(
                'follow_up_required',
                False
            ),
            follow_up_date=request.data.get('follow_up_date')
        )

        create_notification(
            user=appointment.patient.user,
            title="Consultation Started",
            message=f"Dr. {appointment.doctor.full_name} started your consultation."
        )

        serializer = ConsultationSerializer(consultation)

        return api_response(
            success=True,
            data=serializer.data,
            status=status.HTTP_201_CREATED
        )


class ConsultationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            consultation = Consultation.objects.get(pk=pk)

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

        allowed_fields = [
            'symptoms',
            'diagnosis',
            'doctor_notes',
            'follow_up_required',
            'follow_up_date',
            'status'
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(consultation, field, request.data[field])

        consultation.save()

        serializer = ConsultationSerializer(consultation)

        return api_response(
            success=True,
            data=serializer.data
        )


class ConsultationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            consultation = Consultation.objects.get(pk=pk)

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

        serializer = ConsultationSerializer(consultation)

        return api_response(
            success=True,
            data=serializer.data
        )


class PatientConsultationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'PATIENT':
            return api_response(
                success=False,
                error="Patient access required",
                status=status.HTTP_403_FORBIDDEN
            )

        consultations = Consultation.objects.filter(
            patient__user=request.user
        ).order_by('-created_at')

        serializer = ConsultationSerializer(
            consultations,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )


class DoctorConsultationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != 'DOCTOR':
            return api_response(
                success=False,
                error="Doctor access required",
                status=status.HTTP_403_FORBIDDEN
            )

        consultations = Consultation.objects.filter(
            doctor__user=request.user
        ).order_by('-created_at')

        serializer = ConsultationSerializer(
            consultations,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )

class ConsultationSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=404)

        consultation, created = Consultation.objects.get_or_create(
            appointment=appointment,
            defaults={
                'doctor': appointment.doctor,
                'patient': appointment.patient
            }
        )
        
        # Fetch vitals for current consultation only
        vitals_data = None
        has_stored_vitals = False
        current_vitals = ConsultationVitals.objects.filter(consultation=consultation).first()
        
        if current_vitals and (
            current_vitals.blood_pressure or 
            current_vitals.pulse_rate or 
            current_vitals.temperature or 
            current_vitals.oxygen_saturation
        ):
            vitals_data = {
                'blood_pressure': current_vitals.blood_pressure or "",
                'pulse_rate': current_vitals.pulse_rate or "",
                'temperature': current_vitals.temperature or "",
                'oxygen_saturation': current_vitals.oxygen_saturation or "",
                'weight': current_vitals.weight or "",
                'height': current_vitals.height or "",
            }
            has_stored_vitals = True

        # Get current diagnosis and notes
        current_diagnosis = consultation.diagnosis or ""
        current_notes = consultation.doctor_notes or ""

        # Fetch medicines
        medicines_data = []
        for p in consultation.prescriptions.all():
            medicines_data.append({
                "medicine_name": p.medicine_name,
                "dosage": p.dosage,
                "frequency": p.frequency,
                "duration": p.duration,
                "instructions": p.instructions
            })

        session_data = {
            'appointment_id': str(appointment.id),
            'patient_name': appointment.patient.full_name,
            'doctor_name': f"Dr. {appointment.doctor.full_name}",
            'status': consultation.status,
            'booking_date': appointment.booking_date.isoformat(),
            'start_time': appointment.start_time.isoformat(),
            'end_time': appointment.end_time.isoformat(),
            'diagnosis': current_diagnosis,
            'notes': current_notes,
            'vitals': vitals_data,
            'has_stored_vitals': has_stored_vitals,
            'medicines': medicines_data,
        }
        return api_response(success=True, data=session_data)


class ConsultationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=404)

        conversation, _ = Conversation.objects.get_or_create(
            appointment=appointment,
            defaults={
                'patient': appointment.patient,
                'doctor': appointment.doctor
            }
        )
        
        messages = conversation.messages.all().order_by('created_at')
        messages_data = []
        for msg in messages:
            messages_data.append({
                'id': str(msg.id),
                'sender': msg.sender.get_full_name() or msg.sender.username,
                'sender_role': msg.sender.role,
                'message': msg.message,
                'created_at': msg.created_at.isoformat()
            })
        return api_response(success=True, data=messages_data)


class ConsultationSendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        appointment_id = request.data.get('appointment_id')
        message_text = request.data.get('message')
        
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
        except Appointment.DoesNotExist:
            return api_response(success=False, error="Appointment not found", status=404)

        conversation, _ = Conversation.objects.get_or_create(
            appointment=appointment,
            defaults={
                'patient': appointment.patient,
                'doctor': appointment.doctor
            }
        )
        
        msg = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            message=message_text
        )
        
        msg_data = {
            'id': str(msg.id),
            'sender': msg.sender.get_full_name() or msg.sender.username,
            'sender_role': msg.sender.role,
            'message': msg.message,
            'created_at': msg.created_at.isoformat()
        }
        return api_response(success=True, data=msg_data)


class ConsultationSaveVitalsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        appointment_id = request.data.get('appointment_id')
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
            consultation = appointment.consultation
        except (Appointment.DoesNotExist, Consultation.DoesNotExist):
            return api_response(success=False, error="Consultation not found", status=404)

        vitals, _ = ConsultationVitals.objects.get_or_create(consultation=consultation)
        
        serializer = ConsultationVitalsSerializer(vitals, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(success=True, data=serializer.data)
        return api_response(success=False, error=serializer.errors, status=400)


class ConsultationSaveDiagnosisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        appointment_id = request.data.get('appointment_id')
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
            consultation = appointment.consultation
        except (Appointment.DoesNotExist, Consultation.DoesNotExist):
            return api_response(success=False, error="Consultation not found", status=404)

        consultation.symptoms = request.data.get('symptoms', consultation.symptoms)
        consultation.diagnosis = request.data.get('diagnosis', consultation.diagnosis)
        consultation.doctor_notes = request.data.get('notes', consultation.doctor_notes)
        consultation.save()
        
        return api_response(success=True, data="Diagnosis saved successfully")


class ConsultationCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        appointment_id = request.data.get('appointment_id')
        try:
            appointment = Appointment.objects.get(pk=appointment_id)
            consultation = appointment.consultation
        except (Appointment.DoesNotExist, Consultation.DoesNotExist):
            return api_response(success=False, error="Consultation not found", status=404)

        consultation.status = 'COMPLETED'
        consultation.save()
        appointment.status = 'COMPLETED'
        appointment.save()
        
        return api_response(success=True, data="Consultation marked as completed")