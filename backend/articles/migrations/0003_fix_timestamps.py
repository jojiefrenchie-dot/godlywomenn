from django.db import migrations
from django.utils import timezone

def fix_timestamps(apps, schema_editor):
    Article = apps.get_model('articles', 'Article')
    for article in Article.objects.all():
        if not article.published_at:
            article.published_at = article.created_at or timezone.now()
            article.save()

class Migration(migrations.Migration):
    dependencies = [
        ('articles', '0002_tag'),
    ]

    operations = [
        migrations.RunPython(fix_timestamps),
    ]