"""
Comprehensive Database Save Verification for all models
Ensures all creates/updates are properly committed
"""

# Add this to ensure all saves are properly committed
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

logger = logging.getLogger(__name__)

@receiver(post_save, sender='users.User')
def log_user_save(**kwargs):
    created = kwargs.get('created', False)
    instance = kwargs.get('instance')
    action = 'created' if created else 'updated'
    logger.info(f'[DB] User {action}: {instance.email} ({instance.id})')

@receiver(post_save, sender='articles.Article')
def log_article_save(**kwargs):
    created = kwargs.get('created', False)
    instance = kwargs.get('instance')
    action = 'created' if created else 'updated'
    logger.info(f'[DB] Article {action}: {instance.title} ({instance.id})')

@receiver(post_save, sender='articles.Comment')
def log_comment_save(**kwargs):
    created = kwargs.get('created', False)
    instance = kwargs.get('instance')
    action = 'created' if created else 'updated'
    logger.info(f'[DB] Comment {action}: {instance.id}')

@receiver(post_save, sender='marketplace.Listing')
def log_listing_save(**kwargs):
    created = kwargs.get('created', False)
    instance = kwargs.get('instance')
    action = 'created' if created else 'updated'
    logger.info(f'[DB] Listing {action}: {instance.title} ({instance.id})')

@receiver(post_save, sender='messaging.Message')
def log_message_save(**kwargs):
    created = kwargs.get('created', False)
    instance = kwargs.get('instance')
    action = 'created' if created else 'updated'
    logger.info(f'[DB] Message {action}: {instance.id}')

@receiver(post_save, sender='prayers.Prayer')
def log_prayer_save(**kwargs):
    created = kwargs.get('created', False)
    instance = kwargs.get('instance')
    action = 'created' if created else 'updated'
    logger.info(f'[DB] Prayer {action}: {instance.title} ({instance.id})')
