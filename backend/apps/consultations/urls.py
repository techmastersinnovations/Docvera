from django.urls import path

from .views import (
    ConsultationCreateView,
    ConsultationUpdateView,
    ConsultationDetailView,
    PatientConsultationHistoryView,
    DoctorConsultationHistoryView,
    ConsultationSessionView,
    ConsultationMessagesView,
    ConsultationSendMessageView,
    ConsultationSaveVitalsView,
    ConsultationSaveDiagnosisView,
    ConsultationCompleteView
)

urlpatterns = [
    path(
        'create/<uuid:appointment_id>/',
        ConsultationCreateView.as_view(),
        name='consultation_create'
    ),

    path(
        '<uuid:pk>/',
        ConsultationDetailView.as_view(),
        name='consultation_detail'
    ),

    path(
        'update/<uuid:pk>/',
        ConsultationUpdateView.as_view(),
        name='consultation_update'
    ),

    path(
        'history/patient/',
        PatientConsultationHistoryView.as_view(),
        name='patient_consultation_history'
    ),

    path(
        'history/doctor/',
        DoctorConsultationHistoryView.as_view(),
        name='doctor_consultation_history'
    ),

    path(
        'session/<uuid:appointment_id>/',
        ConsultationSessionView.as_view(),
        name='consultation_session'
    ),

    path(
        'messages/<uuid:appointment_id>/',
        ConsultationMessagesView.as_view(),
        name='consultation_messages'
    ),

    path(
        'messages/send/',
        ConsultationSendMessageView.as_view(),
        name='consultation_send_message'
    ),

    path(
        'vitals/',
        ConsultationSaveVitalsView.as_view(),
        name='consultation_vitals'
    ),

    path(
        'diagnosis/',
        ConsultationSaveDiagnosisView.as_view(),
        name='consultation_diagnosis'
    ),

    path(
        'complete/',
        ConsultationCompleteView.as_view(),
        name='consultation_complete'
    ),
]