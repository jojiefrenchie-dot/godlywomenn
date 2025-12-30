import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from articles.models import Article

# Show all articles with their status
for a in Article.objects.all():
    print(f'{a.id}: "{a.title}" - status: {a.status}')
