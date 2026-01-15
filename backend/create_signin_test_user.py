import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
import django
django.setup()

from users.models import User

# Delete if exists
User.objects.filter(email='signin-test@example.com').delete()

# Create new user
user = User.objects.create_user(
    email='signin-test@example.com',
    password='TestPassword123!',
    name='Sign In Test'
)
print(f'Created user: {user.email}')
print(f'Is active: {user.is_active}')
print(f'Password valid: {user.check_password("TestPassword123!")}')