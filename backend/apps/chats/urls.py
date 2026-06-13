from django.urls import path

from .views import (
    ConversationCreateView,
    ConversationListView,
    MessageCreateView,
    MessageListView
)

urlpatterns = [

    path(
        'conversation/create/<uuid:appointment_id>/',
        ConversationCreateView.as_view(),
        name='conversation_create'
    ),

    path(
        'conversations/',
        ConversationListView.as_view(),
        name='conversation_list'
    ),

    path(
        'message/send/<uuid:conversation_id>/',
        MessageCreateView.as_view(),
        name='message_send'
    ),

    path(
        'messages/<uuid:conversation_id>/',
        MessageListView.as_view(),
        name='message_list'
    ),
]