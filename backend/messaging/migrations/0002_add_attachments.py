# Generated migration for adding attachment support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='attachment',
            field=models.FileField(blank=True, null=True, upload_to='message_attachments/%Y/%m/%d/'),
        ),
        migrations.AddField(
            model_name='message',
            name='attachment_type',
            field=models.CharField(
                blank=True,
                null=True,
                max_length=20,
                choices=[('image', 'Image'), ('document', 'Document'), ('other', 'Other')]
            ),
        ),
        migrations.AlterField(
            model_name='message',
            name='content',
            field=models.TextField(blank=True, null=True),
        ),
    ]
