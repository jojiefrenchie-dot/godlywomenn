#!/usr/bin/env python
"""
Database Maintenance and Optimization Script
Performs comprehensive database maintenance tasks
"""
import os
import sys
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

django.setup()

from django.core.management import call_command

print("=" * 70)
print("DATABASE MAINTENANCE AND OPTIMIZATION")
print("=" * 70)

# 1. Check database integrity
print("\n[1] Checking database integrity...")
try:
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA integrity_check;")
        result = cursor.fetchone()[0]
        if result == 'ok':
            print("    ✓ Database integrity check: PASSED")
        else:
            print(f"    ✗ Database integrity issue: {result}")
except Exception as e:
    print(f"    ✗ Error: {e}")

# 2. Optimize database
print("\n[2] Optimizing database...")
try:
    with connection.cursor() as cursor:
        cursor.execute("VACUUM;")
        print("    ✓ Database vacuum: COMPLETED")
except Exception as e:
    print(f"    ✗ Error: {e}")

# 3. Analyze database
print("\n[3] Analyzing database...")
try:
    with connection.cursor() as cursor:
        cursor.execute("ANALYZE;")
        print("    ✓ Database analysis: COMPLETED")
except Exception as e:
    print(f"    ✗ Error: {e}")

# 4. Check for orphaned records
print("\n[4] Checking for orphaned records...")
try:
    from django.db.models import Q
    from articles.models import Article, Comment
    from messaging.models import Message, Conversation
    from users.models import User
    
    # Check articles without authors
    orphaned_articles = Article.objects.filter(author__isnull=True)
    if orphaned_articles.exists():
        count = orphaned_articles.count()
        print(f"    ⚠ Found {count} articles without authors")
    else:
        print("    ✓ No orphaned articles")
    
    # Check comments without articles
    orphaned_comments = Comment.objects.filter(article__isnull=True)
    if orphaned_comments.exists():
        count = orphaned_comments.count()
        print(f"    ⚠ Found {count} comments without articles")
    else:
        print("    ✓ No orphaned comments")
    
    # Check messages without conversations
    orphaned_messages = Message.objects.filter(conversation__isnull=True)
    if orphaned_messages.exists():
        count = orphaned_messages.count()
        print(f"    ⚠ Found {count} messages without conversations")
    else:
        print("    ✓ No orphaned messages")
        
except Exception as e:
    print(f"    ✗ Error: {e}")

# 5. Run migrations
print("\n[5] Checking and applying migrations...")
try:
    call_command('migrate', '--check', verbosity=0)
    print("    ✓ All migrations applied")
except SystemExit:
    print("    ⚠ Unapplied migrations detected, attempting to apply...")
    try:
        call_command('migrate', verbosity=0)
        print("    ✓ Migrations applied successfully")
    except Exception as e:
        print(f"    ✗ Error applying migrations: {e}")
except Exception as e:
    print(f"    ✗ Error: {e}")

# 6. Database statistics
print("\n[6] Database Statistics:")
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        print(f"    ✓ Total tables: {len(tables)}")
        
        total_rows = 0
        for (table_name,) in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            row_count = cursor.fetchone()[0]
            if row_count > 0:
                total_rows += row_count
                print(f"      - {table_name}: {row_count} rows")
        
        print(f"    ✓ Total records: {total_rows}")
except Exception as e:
    print(f"    ✗ Error: {e}")

# 7. Check database file
print("\n[7] Database File Status:")
try:
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'db.sqlite3')
    if os.path.exists(db_path):
        size_kb = os.path.getsize(db_path) / 1024
        size_mb = size_kb / 1024
        if size_mb < 1:
            print(f"    ✓ Database file: {size_kb:.2f} KB")
        else:
            print(f"    ✓ Database file: {size_mb:.2f} MB")
    else:
        print(f"    ✗ Database file not found: {db_path}")
except Exception as e:
    print(f"    ✗ Error: {e}")

print("\n" + "=" * 70)
print("DATABASE MAINTENANCE COMPLETE")
print("=" * 70)
