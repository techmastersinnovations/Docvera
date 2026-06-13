from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    patient_name = serializers.SerializerMethodField()
    specialization = serializers.CharField(source='doctor.specialization', read_only=True)

    # Location fields - handle both Hospital and Doctor clinic details
    hospital_name = serializers.SerializerMethodField()
    clinic_name = serializers.SerializerMethodField()
    clinic_address = serializers.SerializerMethodField()
    clinic_city = serializers.SerializerMethodField()
    clinic_pin_code = serializers.SerializerMethodField()

    # Payment Status Field (Assuming you have a related Payment model)
    payment_status = serializers.SerializerMethodField()

    def get_patient_name(self, obj):
        try:
            return obj.patient.full_name
        except AttributeError:
            return "Unknown Patient"

    def get_hospital_name(self, obj):
        # Return linked hospital name OR doctor's clinic name
        if obj.hospital:
            return obj.hospital.name
        return obj.doctor.clinic_name

    def get_clinic_name(self, obj):
        return obj.doctor.clinic_name

    def get_clinic_address(self, obj):
        return obj.doctor.clinic_address

    def get_clinic_city(self, obj):
        return obj.doctor.clinic_city

    def get_clinic_pin_code(self, obj):
        return obj.doctor.clinic_pin_code

    def get_payment_status(self, obj):
        # Assuming a OneToOne relationship with Payment model named 'payment'
        if hasattr(obj, 'payment'):
            return obj.payment.status  # e.g., 'CAPTURED', 'PENDING'
        return 'UNPAID'

    class Meta:
        model = Appointment
        fields = (
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_name',
            'specialization',
            'hospital',
            'hospital_name',
            'clinic_name',
            'clinic_address',
            'clinic_city',
            'clinic_pin_code',
            'booking_date',
            'start_time',
            'end_time',
            'status',
            'base_amount',
            'platform_fee',
            'total_amount',
            'payment_status',  # Added
            'lock_expires_at',
            'created_at',
            'updated_at'
        )