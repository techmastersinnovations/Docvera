from rest_framework import serializers
from .models import Consultation, ConsultationVitals


class ConsultationSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(
        source='doctor.full_name',
        read_only=True
    )

    patient_name = serializers.CharField(
        source='patient.full_name',
        read_only=True
    )

    appointment_id = serializers.UUIDField(
        source='appointment.id',
        read_only=True
    )

    class Meta:
        model = Consultation

        fields = (
            'id',
            'appointment',
            'appointment_id',
            'doctor',
            'doctor_name',
            'patient',
            'patient_name',
            'symptoms',
            'diagnosis',
            'doctor_notes',
            'follow_up_required',
            'follow_up_date',
            'status',
            'created_at',
            'updated_at'
        )

        read_only_fields = (
            'id',
            'doctor',
            'patient',
            'updated_at'
        )


class ConsultationVitalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationVitals
        fields = (
            'blood_pressure',
            'pulse_rate',
            'temperature',
            'oxygen_saturation',
            'weight',
            'height'
        )