from rest_framework import serializers
from .models import Patient


class PatientProfileSerializer(serializers.ModelSerializer):
    # Read-only fields from the User model
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Patient
        fields = (
            'user',
            'full_name',
            'email',
            'phone',
            'gender',
            'date_of_birth',
            'blood_group',
            'city',
            'pin_code',
            'address',
            'profile_photo',
            'emergency_contact',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('user', 'email', 'phone', 'created_at', 'updated_at')