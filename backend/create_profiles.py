import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from users.models import User

# Create Winnie Adoma
winnie, _ = User.objects.get_or_create(
    email='winnie.adoma@godlywomen.com',
    defaults={
        'name': 'Winnie Adoma',
        'bio': 'Founder and visionary leader of Godly Women in Business. Dedicated to empowering women to excel in their professional callings while maintaining spiritual integrity and faith. With over 15 years of experience in business development and community leadership, Winnie believes that women can transform industries and societies through godly principles.',
        'is_active': True,
    }
)
print(f"Winnie created/updated: {winnie.id}")

# Create Hellen Ojwang
hellen, _ = User.objects.get_or_create(
    email='hellen.ojwang@godlywomen.com',
    defaults={
        'name': 'Hellen Ojwang',
        'bio': 'An esteemed member and role model in our community. Hellen is an accomplished business professional whose grace, wisdom, and unwavering commitment to service inspire many to pursue their calling with integrity. Her life exemplifies how faith and excellence can coexist in the workplace.',
        'is_active': True,
    }
)
print(f"Hellen created/updated: {hellen.id}")

# Create Madam Harriet
harriet, _ = User.objects.get_or_create(
    email='harriet.madam@godlywomen.com',
    defaults={
        'name': 'Madam Harriet',
        'bio': 'A beacon of hope and encouragement in the Godly Women community. Madam Harriet\'s generosity, faith, and compassionate spirit have transformed countless lives. She embodies the virtues of servant leadership and demonstrates daily that true success is measured by the lives we touch and the faith we share.',
        'is_active': True,
    }
)
print(f"Harriet created/updated: {harriet.id}")

print("All profiles created successfully!")
