import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from articles.models import Article
from django.db import models

# Test search for 'snail'
q = Article.objects.filter(
    (models.Q(title__icontains='snail') | models.Q(content__icontains='snail') | models.Q(excerpt__icontains='snail')) &
    models.Q(status='published')
)
print('Search results for snail:', [a.title for a in q])

# Test search for 'dress'
q2 = Article.objects.filter(
    (models.Q(title__icontains='dress') | models.Q(content__icontains='dress') | models.Q(excerpt__icontains='dress')) &
    models.Q(status='published')
)
print('Search results for dress:', [a.title for a in q2])

# Show all published articles
all_pub = Article.objects.filter(status='published')
print('All published articles:', [a.title for a in all_pub])
