# Generated migration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marketplace', '0002_listing_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='countryCode',
            field=models.CharField(blank=True, max_length=4),
        ),
    ]
