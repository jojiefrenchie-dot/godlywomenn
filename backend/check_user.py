#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
print(f"Total users: {User.objects.count()}")
print(f"Username field: {User.USERNAME_FIELD}")
print()

for u in User.objects.all():
    print(f"Email: {u.email}")
    print(f"  Active: {u.is_active}")
    print(f"  Has usable password: {u.has_usable_password()}")
    
    # Test password
    if u.check_password("123456"):
        print(f"  Password '123456' is CORRECT ✓")
    else:
        print(f"  Password '123456' is WRONG ✗")
    print()

# If no users exist, create one
if User.objects.count() == 0:
    print("Creating test user...")
    user = User.objects.create_user(
        email='softwaresfortress@gmail.com',
        password='123456',
        name='Test User'
    )
    print(f"Created user: {user.email}")
