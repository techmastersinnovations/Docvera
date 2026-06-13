from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from apps.common.utils import api_response
from apps.notifications.utils import create_notification

from apps.appointments.models import Appointment

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    MessageSerializer
)


class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        try:
            appointment = Appointment.objects.get(pk=appointment_id)

        except Appointment.DoesNotExist:
            return api_response(
                success=False,
                error="Appointment not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if hasattr(appointment, 'conversation'):
            serializer = ConversationSerializer(
                appointment.conversation
            )

            return api_response(
                success=True,
                data=serializer.data
            )

        conversation = Conversation.objects.create(
            patient=appointment.patient,
            doctor=appointment.doctor,
            appointment=appointment
        )

        serializer = ConversationSerializer(conversation)

        return api_response(
            success=True,
            data=serializer.data,
            status=status.HTTP_201_CREATED
        )


class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role == 'DOCTOR':

            conversations = Conversation.objects.filter(
                doctor__user=request.user
            ).order_by('-created_at')

        elif request.user.role == 'PATIENT':

            conversations = Conversation.objects.filter(
                patient__user=request.user
            ).order_by('-created_at')

        else:
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ConversationSerializer(
            conversations,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )


class MessageCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, conversation_id):

        try:
            conversation = Conversation.objects.get(
                pk=conversation_id
            )

        except Conversation.DoesNotExist:
            return api_response(
                success=False,
                error="Conversation not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if (
            request.user != conversation.patient.user
            and request.user != conversation.doctor.user
        ):
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MessageSerializer(
            data=request.data
        )

        if serializer.is_valid():

            message = serializer.save(
                conversation=conversation,
                sender=request.user
            )

            receiver = (
                conversation.doctor.user
                if request.user == conversation.patient.user
                else conversation.patient.user
            )

            create_notification(
                user=receiver,
                title="New Message",
                message="You received a new message."
            )

            return api_response(
                success=True,
                data=MessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )

        return api_response(
            success=False,
            error=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):

        try:
            conversation = Conversation.objects.get(
                pk=conversation_id
            )

        except Conversation.DoesNotExist:
            return api_response(
                success=False,
                error="Conversation not found",
                status=status.HTTP_404_NOT_FOUND
            )

        if (
            request.user != conversation.patient.user
            and request.user != conversation.doctor.user
        ):
            return api_response(
                success=False,
                error="Unauthorized",
                status=status.HTTP_403_FORBIDDEN
            )

        messages = Message.objects.filter(
            conversation=conversation
        ).order_by('created_at')

        unread_messages = messages.exclude(
            sender=request.user
        ).filter(
            is_read=False
        )

        unread_messages.update(is_read=True)

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return api_response(
            success=True,
            data=serializer.data
        )