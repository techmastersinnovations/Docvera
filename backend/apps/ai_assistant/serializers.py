from rest_framework import serializers
from .models import AIInteraction


class AIInteractionSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIInteraction

        fields = (
            'id',
            'doctor',
            'patient',
            'symptoms',
            'ai_response',
            'created_at'
        )

        read_only_fields = (
            'id',
            'doctor',
            'patient',
            'ai_response',
            'created_at'
        )