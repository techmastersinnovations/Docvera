from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import exceptions

from apps.patients.models import Patient
from apps.doctors.models import Doctor

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'phone',
            'role',
            'is_active',
            'created_at'
        )


class PatientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    full_name = serializers.CharField()
    gender = serializers.ChoiceField(choices=Patient.GENDER_CHOICES)
    date_of_birth = serializers.DateField()
    city = serializers.CharField()
    pin_code = serializers.CharField()
    address = serializers.CharField()

    class Meta:
        model = User

        fields = (
            'email',
            'phone',
            'password',
            'full_name',
            'gender',
            'date_of_birth',
            'city',
            'pin_code',
            'address'
        )

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                phone=validated_data.get('phone'),
                password=validated_data['password'],
                role='PATIENT'
            )

            Patient.objects.create(
                user=user,
                full_name=validated_data['full_name'],
                gender=validated_data['gender'],
                date_of_birth=validated_data['date_of_birth'],
                city=validated_data['city'],
                pin_code=validated_data['pin_code'],
                address=validated_data['address']
            )

            return user


class DoctorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    full_name = serializers.CharField()
    gender = serializers.ChoiceField(choices=Doctor.GENDER_CHOICES)
    date_of_birth = serializers.DateField()

    city = serializers.CharField()
    pin_code = serializers.CharField()
    address = serializers.CharField()

    degree = serializers.CharField()

    degree_certificate = serializers.FileField(
        required=False,
        allow_null=True
    )

    specialization = serializers.ChoiceField(
        choices=Doctor.SPECIALIZATION_CHOICES
    )

    experience_years = serializers.IntegerField()

    medical_council_number = serializers.CharField()

    identity_document = serializers.FileField(
        required=False,
        allow_null=True
    )

    profile_photo = serializers.ImageField(
        required=False,
        allow_null=True
    )

    consultation_fees = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    languages_spoken = serializers.CharField(required=False)
    about = serializers.CharField(required=False)

    clinic_name = serializers.CharField()
    clinic_address = serializers.CharField()
    clinic_city = serializers.CharField()
    clinic_pin_code = serializers.CharField()

    clinic_latitude = serializers.DecimalField(
        max_digits=9,
        decimal_places=6,
        required=False,
        allow_null=True
    )

    clinic_longitude = serializers.DecimalField(
        max_digits=9,
        decimal_places=6,
        required=False,
        allow_null=True
    )

    class Meta:
        model = User

        fields = (
            'email',
            'phone',
            'password',

            'full_name',
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
            'clinic_longitude'
        )

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                phone=validated_data.get('phone'),
                password=validated_data['password'],
                role='DOCTOR'
            )

            Doctor.objects.create(
                user=user,

                full_name=validated_data['full_name'],
                gender=validated_data['gender'],
                date_of_birth=validated_data['date_of_birth'],

                city=validated_data['city'],
                pin_code=validated_data['pin_code'],
                address=validated_data['address'],

                degree=validated_data['degree'],
                degree_certificate=validated_data.get('degree_certificate'),

                specialization=validated_data['specialization'],
                experience_years=validated_data['experience_years'],
                medical_council_number=validated_data['medical_council_number'],

                identity_document=validated_data.get('identity_document'),
                profile_photo=validated_data.get('profile_photo'),

                consultation_fees=validated_data['consultation_fees'],

                languages_spoken=validated_data.get(
                    'languages_spoken',
                    'English, Hindi'
                ),

                about=validated_data.get('about', ''),

                clinic_name=validated_data['clinic_name'],
                clinic_address=validated_data['clinic_address'],
                clinic_city=validated_data['clinic_city'],
                clinic_pin_code=validated_data['clinic_pin_code'],

                clinic_latitude=validated_data.get('clinic_latitude'),
                clinic_longitude=validated_data.get('clinic_longitude'),

                approval_status='PENDING_APPROVAL'
            )

            return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data['user'] = {
            'id': str(user.id),
            'email': user.email,
            'role': user.role
        }

        if user.role == 'DOCTOR':
            doctor_profile = getattr(user, 'doctor_profile', None)

            if not doctor_profile:
                raise exceptions.PermissionDenied(
                    "Doctor profile not found."
                )

            status = doctor_profile.approval_status

            if status == 'PENDING_APPROVAL':
                raise exceptions.PermissionDenied(
                    "Your doctor account is pending administrator approval."
                )

            elif status == 'REJECTED':
                reason = (
                    doctor_profile.rejection_reason
                    or "No reason provided."
                )

                raise exceptions.PermissionDenied(
                    f"Your account registration was rejected. Reason: {reason}"
                )

        return data
