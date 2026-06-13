from django.urls import path

from .views import (
    PrescriptionCreateView,
    PrescriptionListView,
    PrescriptionDeleteView,
    PrescriptionUpdateView,
    PrescriptionPatientHistoryView,
    PrescriptionSaveView
)

urlpatterns = [

    path(
        'create/<uuid:consultation_id>/',
        PrescriptionCreateView.as_view(),
        name='prescription_create'
    ),

    path(
        'list/<uuid:consultation_id>/',
        PrescriptionListView.as_view(),
        name='prescription_list'
    ),

    path(
        'update/<uuid:pk>/',
        PrescriptionUpdateView.as_view(),
        name='prescription_update'
    ),

    path(
        'delete/<uuid:pk>/',
        PrescriptionDeleteView.as_view(),
        name='prescription_delete'
    ),

    path(
        'patient/<str:patient_name>/',
        PrescriptionPatientHistoryView.as_view(),
        name='prescription_patient_history'
    ),

    path(
        'create/',
        PrescriptionSaveView.as_view(),
        name='prescription_save'
    ),
]