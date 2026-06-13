from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(
        source='sender.full_name',
        read_only=True
    )

    class Meta:
        model = Message

        fields = (
            'id',
            'conversation',
            'sender',
            'sender_name',
            'message_type',
            'message',
            'attachment',
            'is_read',
            'created_at'
        )

        read_only_fields = (
            'id',
            'sender',
            'is_read',
            'created_at'
        )


class ConversationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source='patient.full_name',
        read_only=True
    )

    doctor_name = serializers.CharField(
        source='doctor.full_name',
        read_only=True
    )

    latest_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation

        fields = (
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_name',
            'appointment',
            'latest_message',
            'created_at'
        )

    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-created_at').first()

        if not latest:
            return None

        return MessageSerializer(latest).data