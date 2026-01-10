#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from users.models import User

# Create or update a test user with known credentials
email = "test@godlywomen.com"
password = "TestPassword123!"

user, created = User.objects.get_or_create(
    email=email,
    defaults={'name': 'Test User'}
)
user.set_password(password)
user.save()

if created:
    print(f"✓ Created test user: {email}")
else:
    print(f"✓ Updated existing user: {email}")
print(f"Password: {password}")
