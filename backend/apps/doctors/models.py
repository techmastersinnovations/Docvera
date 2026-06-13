from django.db import models
from django.conf import settings


class Doctor(models.Model):
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )

    APPROVAL_CHOICES = (
        ('PENDING_APPROVAL', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    SPECIALIZATION_CHOICES = (
        ('CARDIOLOGY', 'Cardiology'),
        ('DERMATOLOGY', 'Dermatology'),
        ('PEDIATRICS', 'Pediatrics'),
        ('GENERAL_MEDICINE', 'General Medicine'),
        ('ORTHOPEDICS', 'Orthopedics'),
        ('GYNECOLOGY', 'Gynecology'),
        ('NEUROLOGY', 'Neurology'),
        ('OPHTHALMOLOGY', 'Ophthalmology'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='doctor_profile'
    )

    full_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()

    city = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    address = models.TextField()

    degree = models.CharField(max_length=150)
    degree_certificate = models.FileField(
        upload_to='certificates/',
        null=True,
        blank=True
    )

    specialization = models.CharField(
        max_length=50,
        choices=SPECIALIZATION_CHOICES
    )

    experience_years = models.IntegerField(default=0)

    medical_council_number = models.CharField(
        max_length=50,
        unique=True
    )

    identity_document = models.FileField(
        upload_to='identity_docs/',
        null=True,
        blank=True
    )

    profile_photo = models.ImageField(
        upload_to='profile_photos/',
        null=True,
        blank=True
    )

    consultation_fees = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )

    languages_spoken = models.CharField(
        max_length=200,
        default='English, Hindi'
    )

    about = models.TextField(blank=True, null=True)

    clinic_name = models.CharField(max_length=255)
    clinic_address = models.TextField()
    clinic_city = models.CharField(max_length=100)
    clinic_pin_code = models.CharField(max_length=10)

    clinic_latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    clinic_longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    approval_status = models.CharField(
        max_length=20,
        choices=APPROVAL_CHOICES,
        default='PENDING_APPROVAL'
    )

    rejection_reason = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[('ACTIVE', 'Active'), ('SUSPENDED', 'Suspended')],
        default='ACTIVE'
    )
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.full_name} ({self.specialization}) - {self.approval_status}"


class DoctorAvailability(models.Model):
    DAY_CHOICES = (
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )

    day_of_week = models.CharField(
        max_length=15,
        choices=DAY_CHOICES
    )

    start_time = models.TimeField()
    end_time = models.TimeField()

    slot_duration_minutes = models.IntegerField(default=15)

    class Meta:
        unique_together = (
            'doctor',
            'day_of_week',
            'start_time',
            'end_time'
        )

    def __str__(self):
        return f"{self.doctor.full_name} - {self.day_of_week} ({self.start_time} - {self.end_time})"