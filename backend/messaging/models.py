from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Conversation(models.Model):
    """Represents a conversation between two users"""
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        names = ', '.join([u.email for u in self.participants.all()])
        return f"Conversation: {names}"

    @staticmethod
    def get_or_create_conversation(user1, user2):
        """Get or create a conversation between two users"""
        conversation = Conversation.objects.filter(
            participants=user1
        ).filter(
            participants=user2
        ).first()
        
        if not conversation:
            conversation = Conversation.objects.create()
            conversation.participants.add(user1, user2)
        
        return conversation


class Message(models.Model):
    """Represents a message in a conversation"""
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to='message_attachments/%Y/%m/%d/', blank=True, null=True)
    attachment_type = models.CharField(
        max_length=20,
        choices=[('image', 'Image'), ('document', 'Document'), ('other', 'Other')],
        blank=True,
        null=True
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        if self.content:
            return f"{self.sender.email}: {self.content[:50]}"
        return f"{self.sender.email}: [Attachment: {self.attachment_type}]"
