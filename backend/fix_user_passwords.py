import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
import django
django.setup()

from users.models import User

# Get all users and set password
users = User.objects.all()
print(f"Found {users.count()} users")

for user in users:
    # Set password for all users
    user.set_password('TestPassword123!')
    user.is_active = True
    user.save()
    print(f"✓ Updated {user.email}")

print(f"\n✓ All users can now sign in with password: TestPassword123!")