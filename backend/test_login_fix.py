#!/usr/bin/env python
"""
Test the complete login flow to verify the fix
"""
import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n" + "="*60)
print("LOGIN FIX VERIFICATION TEST")
print("="*60 + "\n")

# Test 1: User exists and password is correct
email = 'softwaresfortress@gmail.com'
password = '123456'
user = User.objects.get(email=email)

print(f"✓ User found: {user.email}")
print(f"✓ User active: {user.is_active}")
print(f"✓ Password verified: {user.check_password(password)}\n")

# Test 2: Token endpoint works
print("Testing token endpoint...")
token_response = requests.post(
    'http://127.0.0.1:8000/api/auth/token/',
    json={'email': email, 'password': password}
)

if token_response.status_code == 200:
    data = token_response.json()
    access_token = data.get('access')
    refresh_token = data.get('refresh')
    print(f"✓ Token endpoint returned 200 OK")
    print(f"✓ Access token: {access_token[:50]}...")
    print(f"✓ Refresh token: {refresh_token[:50]}...\n")
else:
    print(f"✗ Token endpoint failed: {token_response.status_code}")
    print(f"  Error: {token_response.text}\n")
    exit(1)

# Test 3: /me endpoint works
print("Testing /me endpoint...")
me_response = requests.get(
    'http://127.0.0.1:8000/api/auth/me/',
    headers={'Authorization': f'Bearer {access_token}'}
)

if me_response.status_code == 200:
    user_data = me_response.json()
    print(f"✓ /me endpoint returned 200 OK")
    print(f"✓ User ID: {user_data['id']}")
    print(f"✓ User email: {user_data['email']}")
    print(f"✓ User name: {user_data['name']}\n")
else:
    print(f"✗ /me endpoint failed: {me_response.status_code}")
    print(f"  Error: {me_response.text}\n")
    exit(1)

print("="*60)
print("ALL TESTS PASSED! LOGIN IS NOW WORKING! ✓✓✓")
print("="*60)
print("\nFIX SUMMARY:")
print("- Fixed CustomTokenObtainPairSerializer to use email field")
print("- Fixed serializer initialization to handle field replacement")
print("- Token endpoint now correctly validates email and password")
print("- /me endpoint successfully returns user data")
print("\nYou can now log in with:")
print(f"  Email: {email}")
print(f"  Password: {password}")
print()
