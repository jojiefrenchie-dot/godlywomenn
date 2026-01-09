from django.db import migrations
from django.utils.text import slugify


def create_default_categories(apps, schema_editor):
    """Create default categories if they don't exist"""
    Category = apps.get_model('articles', 'Category')
    
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
    
    for category_data in default_categories:
        # Check if category already exists
        if not Category.objects.filter(name=category_data['name']).exists():
            slug = slugify(category_data['name'])
            # Ensure unique slug
            counter = 1
            original_slug = slug
            while Category.objects.filter(slug=slug).exists():
                slug = f"{original_slug}-{counter}"
                counter += 1
            
            Category.objects.create(
                name=category_data['name'],
                slug=slug,
                description=category_data['description']
            )
            print(f"Created category: {category_data['name']}")


def reverse_create_categories(apps, schema_editor):
    """Reverse function - optional"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0007_comment_articlelike_commentlike'),
    ]

    operations = [
        migrations.RunPython(create_default_categories, reverse_create_categories),
    ]
