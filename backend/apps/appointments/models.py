from django.db import models
import uuid


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Payment'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
        ('REFUNDED', 'Refunded'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='appointments')


    # Make hospital optional to support Doctor-First flow using clinic details
    hospital = models.ForeignKey(
        'hospitals.Hospital',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )

    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    # Financial Fields
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    lock_expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['doctor', 'booking_date', 'start_time']),
            models.Index(fields=['patient', 'booking_date']),
        ]

    def save(self, *args, **kwargs):
        self.total_amount = self.base_amount + self.platform_fee
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Appt {self.id} - Dr. {self.doctor.full_name} with Patient {self.patient.full_name} ({self.status})"
