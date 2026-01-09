#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("📋 Current users in database:")
print("-" * 50)
for user in User.objects.all():
    print(f"  Email: {user.email}")
    print(f"  Is Staff: {user.is_staff}")
    print(f"  Is Superuser: {user.is_superuser}")
    print()

# Reset password for existing user
email = 'mburugeorge692@gmail.com'
password = 'AdminPassword123!'

try:
    user = User.objects.get(email=email)
    user.set_password(password)
    user.save()
    print(f"✓ Password successfully reset!")
    print(f"  Email: {email}")
    print(f"  Password: {password}")
except User.DoesNotExist:
    print(f"✗ User with email {email} not found")
except Exception as e:
    print(f"✗ Error: {str(e)}")
