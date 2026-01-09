from django.apps import AppConfig


class ArticlesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'articles'

    def ready(self):
        """Initialize default categories when app starts"""
        try:
            from django.utils.text import slugify
            from .models import Category
            
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
            
            # Create default categories if they don't exist
            for category_data in default_categories:
                Category.objects.get_or_create(
                    name=category_data['name'],
                    defaults={
                        'slug': slugify(category_data['name']),
                        'description': category_data['description']
                    }
                )
        except Exception as e:
            # Silently fail during migrations or if table doesn't exist yet
            pass
