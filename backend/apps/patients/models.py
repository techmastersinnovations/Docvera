# apps/patients/models.py

from django.db import models
from django.conf import settings

class Patient(models.Model):
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )

    BLOOD_GROUP_CHOICES = (
        ('A_POSITIVE', 'A+'),
        ('A_NEGATIVE', 'A-'),
        ('B_POSITIVE', 'B+'),
        ('B_NEGATIVE', 'B-'),
        ('O_POSITIVE', 'O+'),
        ('O_NEGATIVE', 'O-'),
        ('AB_POSITIVE', 'AB+'),
        ('AB_NEGATIVE', 'AB-'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='patient_profile'
    )

    full_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()

    # Model fields synchronized with PatientProfileSerializer layout
    blood_group = models.CharField(max_length=50, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
    emergency_contact = models.CharField(max_length=15, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='patient_photos/', null=True, blank=True)

    city = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    address = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Patient: {self.full_name} ({self.user.email})"