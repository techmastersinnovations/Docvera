from django.urls import path

from .views import (
    AIMedicalSuggestionView,
    AIInteractionHistoryView
)

urlpatterns = [

    path(
        'suggest/<uuid:patient_id>/',
        AIMedicalSuggestionView.as_view(),
        name='ai_medical_suggestion'
    ),

    path(
        'history/',
        AIInteractionHistoryView.as_view(),
        name='ai_interaction_history'
    ),
]