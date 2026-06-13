from django.db import models
import uuid


class MedicalRecord(models.Model):
    RECORD_TYPE_CHOICES = (
        ('LAB_REPORT', 'Lab Report'),
        ('XRAY', 'X-Ray'),
        ('SCAN', 'Scan'),
        ('PRESCRIPTION', 'Prescription'),
        ('OTHER', 'Other'),
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.CASCADE,
        related_name='medical_records'
    )

    doctor = models.ForeignKey(
        'doctors.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medical_records'
    )

    consultation = models.ForeignKey(
        'consultations.Consultation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medical_records'
    )

    title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    record_type = models.CharField(
        max_length=50,
        choices=RECORD_TYPE_CHOICES
    )

    file = models.FileField(
        upload_to='medical_records/'
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.patient.full_name}"