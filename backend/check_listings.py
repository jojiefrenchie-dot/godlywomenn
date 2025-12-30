import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from marketplace.models import Listing
from django.contrib.auth import get_user_model

User = get_user_model()

print("=== LISTINGS ===")
for l in Listing.objects.all():
    print(f"ID: {l.id}, Title: {l.title}, Owner Email: {l.owner.email}, Owner ID: {l.owner.id}")

print("\n=== USERS ===")
for u in User.objects.all():
    print(f"ID: {u.id}, Email: {u.email}")
