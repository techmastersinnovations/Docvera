from rest_framework import serializers
from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(
        source='consultation.doctor.full_name',
        read_only=True
    )

    patient_name = serializers.CharField(
        source='consultation.patient.full_name',
        read_only=True
    )

    class Meta:
        model = Prescription

        fields = (
            'id',
            'consultation',
            'doctor_name',
            'patient_name',
            'medicine_name',
            'dosage',
            'frequency',
            'duration',
            'instructions',
            'created_at'
        )

        read_only_fields = (
            'id',
            'created_at'
        )