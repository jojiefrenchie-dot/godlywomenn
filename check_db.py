#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

django.setup()

from django.db import connection
from users.models import User
from articles.models import Article, Category
from marketplace.models import Listing
from messaging.models import Conversation, Message
from prayers.models import Prayer

print("=" * 60)
print("DATABASE INTEGRITY CHECK")
print("=" * 60)

# Check tables
with connection.cursor() as cursor:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print(f"\n✓ Found {len(tables)} tables")

# Count records in each table
stats = {
    'Users': User.objects.count(),
    'Articles': Article.objects.count(),
    'Categories': Category.objects.count(),
    'Marketplace Listings': Listing.objects.count(),
    'Conversations': Conversation.objects.count(),
    'Messages': Message.objects.count(),
    'Prayers': Prayer.objects.count(),
}

print("\nRecord Counts:")
for model, count in stats.items():
    print(f"  {model}: {count}")

# Check for any database corruption
print("\nDatabase Integrity:")
try:
    # Test integrity
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA integrity_check;")
        result = cursor.fetchone()[0]
        if result == 'ok':
            print("  ✓ Database integrity: OK")
        else:
            print(f"  ✗ Database integrity: {result}")
except Exception as e:
    print(f"  ✗ Error checking integrity: {e}")

print("\n" + "=" * 60)
print("Database check complete!")
print("=" * 60)
