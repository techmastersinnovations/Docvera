from rest_framework import serializers
from .models import MedicalRecord


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source='patient.full_name',
        read_only=True
    )

    doctor_name = serializers.CharField(
        source='doctor.full_name',
        read_only=True
    )

    class Meta:
        model = MedicalRecord

        fields = (
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_name',
            'consultation',
            'title',
            'description',
            'record_type',
            'file',
            'uploaded_at'
        )

        read_only_fields = (
            'id',
            'uploaded_at'
        )