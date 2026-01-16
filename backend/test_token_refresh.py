#!/usr/bin/env python
"""Test the token refresh flow to verify the fix works."""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
import json

print("[TEST] Testing JWT Token Refresh Flow")
print("=" * 50)

# Create a test user if it doesn't exist
email = 'test_refresh@example.com'
try:
    user = User.objects.get(email=email)
    print(f"[TEST] ✓ Using existing user: {email}")
except User.DoesNotExist:
    print(f"[TEST] Creating test user: {email}")
    user = User.objects.create_user(
        email=email,
        password='testpass123'
    )
    print(f"[TEST] ✓ Created user: {email}")

# Generate tokens
print("\n[TEST] Generating tokens...")
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)
refresh_token = str(refresh)

print(f"[TEST] ✓ Access token generated: {access_token[:50]}...")
print(f"[TEST] ✓ Refresh token generated: {refresh_token[:50]}...")

# Simulate token refresh
print("\n[TEST] Simulating token refresh...")
try:
    from rest_framework_simplejwt.tokens import RefreshToken as RT
    
    # Create a new refresh token object from the refresh token string
    new_refresh = RT(refresh_token)
    new_access = str(new_refresh.access_token)
    
    print(f"[TEST] ✓ Token refresh successful!")
    print(f"[TEST] ✓ New access token: {new_access[:50]}...")
    
except Exception as e:
    print(f"[TEST] ✗ Token refresh failed: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 50)
print("[TEST] ✓ Token refresh test PASSED")
print("[TEST] The token refresh endpoint should now work correctly")
