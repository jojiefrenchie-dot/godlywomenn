import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
import django
django.setup()

from users.models import User

users = User.objects.all()
print(f'Total users: {users.count()}\n')
for user in users:
    valid = user.check_password('TestPassword123!')
    status = 'OK' if valid else 'FAIL'
    print(f'{status} {user.email}: password_valid={valid}')