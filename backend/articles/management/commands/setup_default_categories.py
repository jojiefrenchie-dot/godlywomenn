from django.core.management.base import BaseCommand
from articles.models import Category

class Command(BaseCommand):
    help = 'Sets up default categories for articles'

    def handle(self, *args, **kwargs):
        # Define default categories
        default_categories = [
            {
                'name': 'Testimony',
                'description': 'Share your personal testimony and experiences'
            },
            {
                'name': 'Referral',
                'description': 'Share helpful resources and recommendations'
            },
            {
                'name': 'Prayer',
                'description': 'Share prayers and prayer requests'
            },
            {
                'name': 'Poem',
                'description': 'Share spiritual and inspirational poems'
            },
            {
                'name': 'Bible Verse',
                'description': 'Share and discuss meaningful Bible verses'
            },
            {
                'name': 'Other',
                'description': 'Other types of spiritual content'
            },
            {
                'name': 'Feedback',
                'description': 'Provide feedback and suggestions'
            },
        ]

        # Remove any existing categories (including 'smoke cat')
        Category.objects.all().delete()

        # Create new categories
        for category_data in default_categories:
            Category.objects.create(**category_data)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created category "{category_data["name"]}"')
            )