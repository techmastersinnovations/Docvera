from django.contrib import admin
from .models import MedicalRecord


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'patient',
        'doctor',
        'record_type',
        'uploaded_at'
    )

    list_filter = (
        'record_type',
        'uploaded_at'
    )