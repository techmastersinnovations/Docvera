from rest_framework import serializers
from .models import Doctor, DoctorAvailability

# Ensure this path matches your project structure.
# If hospitals is in apps.hospitals, use: from apps.hospitals.serializers import HospitalSerializer
try:
    from apps.hospitals.serializers import HospitalSerializer
except ImportError:
    # Fallback if you haven't created the hospital serializer yet or structure is different
    class HospitalSerializer(serializers.Serializer):
        id = serializers.UUIDField()
        name = serializers.CharField()
        city = serializers.CharField()
        address = serializers.CharField()


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = (
            'id',
            'day_of_week',
            'start_time',
            'end_time',
            'slot_duration_minutes'
        )


class DoctorSerializer(serializers.ModelSerializer):
    availabilities = DoctorAvailabilitySerializer(
        many=True,
        read_only=True
    )

    email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    phone = serializers.CharField(
        source='user.phone',
        read_only=True
    )

    # Include affiliated hospitals via the Many-to-Many relationship
    affiliated_hospitals = serializers.SerializerMethodField()

    def get_affiliated_hospitals(self, obj):
        """
        Fetches all hospitals linked to this doctor via the DoctorHospital intermediate table.
        """
        # Access the reverse foreign key from DoctorHospital to Doctor
        # related_name='hospital_affiliations' in DoctorHospital model
        affiliations = obj.hospital_affiliations.select_related('hospital').all()

        # Extract the actual Hospital instances
        hospitals = [aff.hospital for aff in affiliations]

        # Serialize them using the HospitalSerializer
        return HospitalSerializer(hospitals, many=True).data

    class Meta:
        model = Doctor

        fields = (
            'user',
            'full_name',
            'email',
            'phone',
            'gender',
            'date_of_birth',
            'city',
            'pin_code',
            'address',
            'degree',
            'degree_certificate',
            'specialization',
            'experience_years',
            'medical_council_number',
            'identity_document',
            'profile_photo',
            'consultation_fees',
            'languages_spoken',
            'about',
            'clinic_name',
            'clinic_address',
            'clinic_city',
            'clinic_pin_code',
            'clinic_latitude',
            'clinic_longitude',
            'approval_status',
            'rejection_reason',
            'availabilities',
            'affiliated_hospitals',
            'created_at',
            'updated_at'
        )