#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(email='softwaresfortress@gmail.com')
user.set_password('123456')
user.save()
print(f"Updated password for {user.email}")
print(f"Password check: {user.check_password('123456')}")
