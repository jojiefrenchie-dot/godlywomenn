from django.db import models
from django.utils import timezone
import uuid
from users.models import User

class Prayer(models.Model):
    PRAYER_TYPES = (
        ('request', 'Prayer Request'),
        ('testimony', 'Testimony'),
        ('praise', 'Praise Report'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    prayer_type = models.CharField(max_length=20, choices=PRAYER_TYPES, default='request')
    is_anonymous = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prayers')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title

class PrayerResponse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prayer = models.ForeignKey(Prayer, on_delete=models.CASCADE, related_name='responses')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Response to {self.prayer.title} by {self.author.username}"

class PrayerSupport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prayer = models.ForeignKey(Prayer, on_delete=models.CASCADE, related_name='supporters')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('prayer', 'user')
        
    def __str__(self):
        return f"{self.user.username} is praying for {self.prayer.title}"

class PrayerResponseLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    response = models.ForeignKey(PrayerResponse, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('response', 'user')
        
    def __str__(self):
        return f"{self.user.username} liked response {self.response.id}"
