#!/usr/bin/env python
import os
import sys
import django

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from users.models import User

# Delete old test user if exists
User.objects.filter(email='logintest@example.com').delete()

# Create new user with known password
user = User.objects.create_user(
    email='logintest@example.com',
    name='Login Test',
    password='TestPassword123!'
)
print(f"✓ Created user: {user.email}")
print(f"Password: TestPassword123!")
print(f"Is active: {user.is_active}")
