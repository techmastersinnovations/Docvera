from django.db import models
import uuid

class Hospital(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.city})"

class DoctorHospital(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='hospital_affiliations')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='doctor_affiliations')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('doctor', 'hospital')

    def __str__(self):
        return f"Dr. {self.doctor.full_name} @ {self.hospital.name}"
