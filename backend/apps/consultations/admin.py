from django.contrib import admin
from .models import Consultation


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'doctor',
        'patient',
        'status',
        'created_at'
    )

    search_fields = (
        'doctor__full_name',
        'patient__full_name'
    )

    list_filter = (
        'status',
        'created_at'
    )