import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
import django
django.setup()

from users.models import User

# Check if account exists and password is correct
email = 'winnie.adoma@godlywomen.com'
password = 'TestPassword123!'

user = User.objects.filter(email=email).first()
if user:
    print(f'Found user: {user.email}')
    print(f'Is Active: {user.is_active}')
    print(f'Password Hash: {user.password[:50]}...' if user.password else 'No password')
    
    # Test password
    is_valid = user.check_password(password)
    print(f'Password Valid: {is_valid}')
    
    if not is_valid:
        print('\nPassword is NOT valid. Resetting...')
        user.set_password(password)
        user.save()
        print(f'✓ Password reset and verified: {user.check_password(password)}')
else:
    print(f'User {email} not found!')
