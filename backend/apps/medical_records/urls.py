from django.urls import path

from .views import (
    MedicalRecordUploadView,
    PatientMedicalHistoryView,
    DoctorPatientMedicalHistoryView
)

urlpatterns = [
    path(
        'upload/<uuid:consultation_id>/',
        MedicalRecordUploadView.as_view(),
        name='medical_record_upload'
    ),

    path(
        'history/patient/',
        PatientMedicalHistoryView.as_view(),
        name='patient_medical_history'
    ),

    path(
        'history/doctor/<uuid:patient_id>/',
        DoctorPatientMedicalHistoryView.as_view(),
        name='doctor_patient_medical_history'
    ),
]