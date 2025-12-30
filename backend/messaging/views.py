from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    ConversationDetailSerializer,
    MessageSerializer
)


class IsParticipant(permissions.BasePermission):
    """Only allow participants of a conversation to view it"""
    def has_object_permission(self, request, view, obj):
        return request.user in obj.participants.all()


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = []

    def get_queryset(self):
        """Return conversations for the current user"""
        return Conversation.objects.filter(participants=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConversationDetailSerializer
        return ConversationSerializer

    @action(detail=False, methods=['post'])
    def start_conversation(self, request):
        """Start a new conversation with a user"""
        other_user_id = request.data.get('user_id')

        if not other_user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize and validate the incoming user_id to avoid invalid types
        from urllib.parse import unquote_plus
        import uuid

        try:
            if isinstance(other_user_id, (int, float)):
                other_user_id = str(other_user_id)
            other_user_id = unquote_plus(str(other_user_id)).strip()
        except Exception:
            return Response({'error': 'Invalid user_id format'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the id is a valid UUID before querying
        try:
            uuid.UUID(other_user_id)
        except (ValueError, TypeError):
            return Response({'error': 'user_id must be a valid UUID'}, status=status.HTTP_400_BAD_REQUEST)

        from users.models import User
        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        conversation = Conversation.get_or_create_conversation(request.user, other_user)
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark all messages in conversation as read"""
        conversation = self.get_object()
        self.check_object_permissions(request, conversation)
        
        conversation.messages.filter(is_read=False).exclude(
            sender=request.user
        ).update(is_read=True)
        
        return Response({'status': 'Messages marked as read'})


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.request.query_params.get('conversation_id')
        if conversation_id:
            conversation = get_object_or_404(Conversation, id=conversation_id)
            if self.request.user not in conversation.participants.all():
                return Message.objects.none()
            return conversation.messages.all()
        return Message.objects.filter(
            conversation__participants=self.request.user
        )

    def perform_create(self, serializer):
        """Create a new message"""
        conversation_id = self.request.data.get('conversation_id')
        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        # Check if user is a participant
        if self.request.user not in conversation.participants.all():
            raise PermissionError('You are not a participant in this conversation')
        
        serializer.save(sender=self.request.user, conversation=conversation)

    def create(self, request, *args, **kwargs):
        """Create a message"""
        conversation_id = request.data.get('conversation_id')
        content = request.data.get('content')
        attachment = request.FILES.get('attachment') if request.FILES else None

        # Allow either content or attachment, but require at least one
        if not conversation_id or (not content and not attachment):
            return Response(
                {'error': 'conversation_id and either content or attachment are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        conversation = get_object_or_404(Conversation, id=conversation_id)
        
        # Check permissions
        if request.user not in conversation.participants.all():
            return Response(
                {'error': 'You are not a participant in this conversation'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Determine attachment type
        attachment_type = None
        if attachment:
            file_ext = attachment.name.split('.')[-1].lower() if '.' in attachment.name else ''
            image_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
            doc_exts = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']
            
            if file_ext in image_exts:
                attachment_type = 'image'
            elif file_ext in doc_exts:
                attachment_type = 'document'
            else:
                attachment_type = 'other'

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content or '',
            attachment=attachment,
            attachment_type=attachment_type
        )

        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
