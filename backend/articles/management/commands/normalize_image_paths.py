from django.core.management.base import BaseCommand
from django.db import transaction

try:
    from articles.models import Article
except Exception:
    # In some environments the app label may require import differently
    from backend.articles.models import Article


class Command(BaseCommand):
    help = 'Normalize featured_image paths by stripping any leading media/ or /media/ prefixes'

    def handle(self, *args, **options):
        qs = Article.objects.exclude(featured_image__isnull=True).exclude(featured_image__exact='')
        total = qs.count()
        updated = 0
        self.stdout.write(f'Found {total} articles with featured_image')

        with transaction.atomic():
            for article in qs:
                raw = str(article.featured_image)
                if not raw:
                    continue

                # Normalize: remove leading slashes, then remove leading 'media/' if present
                normalized = raw.lstrip('/')
                if normalized.startswith('media/'):
                    new_path = normalized[len('media/'):]
                else:
                    # also handle accidental double media/media
                    if normalized.startswith('media/media/'):
                        new_path = normalized[len('media/'):]
                    else:
                        # nothing to change
                        new_path = None

                if new_path and new_path != raw:
                    article.featured_image = new_path
                    article.save(update_fields=['featured_image'])
                    updated += 1
                    self.stdout.write(f'Updated Article {article.id}: "{raw}" -> "{new_path}"')

        self.stdout.write(self.style.SUCCESS(f'Completed: updated {updated} of {total} articles'))
