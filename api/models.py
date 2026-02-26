from django.db import models
from django.contrib.auth.models import User
import hashlib

class CustomUser(models.Model):
    user_id = models.CharField(max_length=100, primary_key=True, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    name = models.CharField(max_length=200)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return hashlib.sha256(password.encode()).hexdigest() == self.password_hash
    
    @staticmethod
    def hash_password(password):
        """Hash a password"""
        return hashlib.sha256(password.encode()).hexdigest()

class MarketplaceItem(models.Model):
    ITEM_TYPES = (
        ('Product', 'Product'),
        ('Service', 'Service'),
        ('Event', 'Event'),
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    type = models.CharField(max_length=20, choices=ITEM_TYPES, default='Product')
    date = models.DateTimeField(null=True, blank=True)
    contact = models.CharField(max_length=200, blank=True)
    country_code = models.CharField(max_length=2, blank=True)
    image = models.URLField(blank=True)
    owner_id = models.CharField(max_length=100)
    owner_email = models.EmailField()
    owner_name = models.CharField(max_length=100, default='Test User')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Article(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=300)
    excerpt = models.TextField(blank=True)
    content = models.TextField()
    author_id = models.CharField(max_length=100)
    author_email = models.EmailField()
    author_name = models.CharField(max_length=100, default='Author')
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.URLField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    views_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Prayer(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=300)
    content = models.TextField()
    author_id = models.CharField(max_length=100)
    author_email = models.EmailField()
    author_name = models.CharField(max_length=100, default='Author')
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=100, blank=True)
    likes_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
