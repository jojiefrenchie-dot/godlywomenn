#!/usr/bin/env python
"""
Comprehensive test of the authentication system.
Tests the entire flow from registration to login.
"""
import os
import sys
import django
import json
from django.test import Client

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from users.models import User

print("=" * 80)
print("AUTHENTICATION SYSTEM TEST")
print("=" * 80)

# Create test client
client = Client()

# Test 1: Check if token endpoint exists
print("\n[TEST 1] Checking if /api/auth/token/ endpoint exists...")
response = client.options('/api/auth/token/')
print(f"  OPTIONS /api/auth/token/ → {response.status_code}")
if response.status_code == 200:
    print("  ✓ Endpoint exists and accepts OPTIONS")
else:
    print(f"  ✗ Endpoint returned {response.status_code}")

# Test 2: Create a test user
print("\n[TEST 2] Creating test user...")
test_email = "test-auth@example.com"
test_password = "TestPassword123!"

# Delete existing test user if present
User.objects.filter(email=test_email).delete()

# Create new user
test_user = User.objects.create_user(email=test_email, password=test_password, name="Test User")
print(f"  ✓ Created user: {test_user.email} (ID: {test_user.id})")
print(f"  ✓ User is_active: {test_user.is_active}")
print(f"  ✓ Password hash set: {bool(test_user.password)}")

# Test 3: Try to authenticate with POST
print("\n[TEST 3] Testing POST /api/auth/token/ with credentials...")
token_response = client.post(
    '/api/auth/token/',
    data=json.dumps({'email': test_email, 'password': test_password}),
    content_type='application/json'
)
print(f"  Status: {token_response.status_code}")

if token_response.status_code == 200:
    token_data = json.loads(token_response.content)
    print(f"  ✓ Got tokens:")
    print(f"    - access: {token_data['access'][:50]}...")
    print(f"    - refresh: {token_data['refresh'][:50]}...")
elif token_response.status_code in [400, 401]:
    error_data = json.loads(token_response.content)
    print(f"  ✗ Authentication failed:")
    print(f"    {error_data}")
else:
    print(f"  ✗ Unexpected status code: {token_response.status_code}")
    print(f"    Response: {token_response.content[:200]}")

# Test 4: Try registration
print("\n[TEST 4] Testing POST /api/auth/register/...")
register_email = "newuser-test@example.com"
User.objects.filter(email=register_email).delete()

register_response = client.post(
    '/api/auth/register/',
    data=json.dumps({
        'name': 'New Test User',
        'email': register_email,
        'password': 'NewUserPass123!'
    }),
    content_type='application/json'
)
print(f"  Status: {register_response.status_code}")

if register_response.status_code in [200, 201]:
    print(f"  ✓ Registration successful")
    reg_data = json.loads(register_response.content)
    print(f"    User created: {reg_data.get('user', {}).get('email')}")
elif register_response.status_code == 400:
    error_data = json.loads(register_response.content)
    print(f"  ✗ Registration failed:")
    print(f"    {error_data}")
else:
    print(f"  ✗ Unexpected status code: {register_response.status_code}")

# Cleanup
print("\n[CLEANUP] Removing test users...")
User.objects.filter(email__in=[test_email, register_email]).delete()
print("  ✓ Test users removed")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
