from django.core.management.base import BaseCommand
from articles.models import Category

class Command(BaseCommand):
    help = 'Seeds initial categories'

    def handle(self, *args, **kwargs):
        categories = [
            {'name': 'Bible Verse', 'description': 'Insights and reflections on Bible verses'},
            {'name': 'Feedback', 'description': 'Community feedback and discussions'},
            {'name': 'Other', 'description': 'Miscellaneous topics'},
            {'name': 'Poem', 'description': 'Faith-inspired poetry'},
            {'name': 'Prayer', 'description': 'Prayer requests and answered prayers'},
            {'name': 'Referral', 'description': 'Recommendations and referrals'},
            {'name': 'Testimony', 'description': 'Personal testimonies of faith'},
        ]

        for cat_data in categories:
            Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created category "{cat_data["name"]}"')
            )