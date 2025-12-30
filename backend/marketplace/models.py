from django.db import models
from django.conf import settings


class Listing(models.Model):
    TYPE_CHOICES = [
        ("Product", "Product"),
        ("Service", "Service"),
        ("Event", "Event"),
    ]

    CURRENCY_CHOICES = [
        ("KSH", "Kenyan Shilling"),
        ("USD", "US Dollar"),
        ("EUR", "Euro"),
        ("GBP", "British Pound"),
        ("ZAR", "South African Rand"),
        ("UGX", "Ugandan Shilling"),
        ("TZS", "Tanzanian Shilling"),
        ("RWF", "Rwandan Franc"),
        ("ETB", "Ethiopian Birr"),
        ("NGN", "Nigerian Naira"),
        ("GHS", "Ghanaian Cedi"),
    ]

    id = models.BigAutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.CharField(max_length=64, blank=True)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='KSH')
    type = models.CharField(max_length=16, choices=TYPE_CHOICES, default='Product')
    contact = models.CharField(max_length=255, blank=True)
    countryCode = models.CharField(max_length=4, blank=True)
    image = models.ImageField(upload_to='marketplace/', null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

