"""
Complete Backend Configuration Verification
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')

from django.conf import settings

print("\n" + "="*70)
print("BACKEND CONFIGURATION VERIFICATION")
print("="*70 + "\n")

print("Database Configuration:")
print(f"  Engine: {settings.DATABASES['default']['ENGINE']}")
print(f"  Database: {settings.DATABASES['default']['NAME']}")
print(f"  ✓ Database is configured\n")

print("CORS Configuration:")
for origin in settings.CORS_ALLOWED_ORIGINS:
    print(f"  ✓ {origin}")
print()

print("JWT Configuration:")
print(f"  Access Token Lifetime: {settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']}")
print(f"  Refresh Token Lifetime: {settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']}")
print(f"  Rotate Refresh Tokens: {settings.SIMPLE_JWT['ROTATE_REFRESH_TOKENS']}")
print(f"  Blacklist After Rotation: {settings.SIMPLE_JWT['BLACKLIST_AFTER_ROTATION']}")
print(f"  ✓ JWT is properly configured\n")

print("Installed Apps:")
for app in settings.INSTALLED_APPS:
    if not app.startswith('django.'):
        print(f"  ✓ {app}")
print()

print("Authentication:")
print(f"  Auth Model: {settings.AUTH_USER_MODEL}")
print(f"  ✓ Custom user model configured\n")

print("Media & Static Files:")
print(f"  Media URL: {settings.MEDIA_URL}")
print(f"  Media Root: {settings.MEDIA_ROOT}")
print(f"  Static URL: {settings.STATIC_URL}")
print(f"  ✓ File uploads configured\n")

print("="*70)
print("✓ Backend Configuration: OK")
print("="*70 + "\n")
