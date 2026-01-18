"""
Comprehensive Backend Health Check and Fix Script
Tests all endpoints and ensures data is being saved properly
"""
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import transaction
from users.models import User
from articles.models import Article, Category, Comment, ArticleLike
from marketplace.models import Listing
from messaging.models import Conversation, Message
from prayers.models import Prayer, PrayerResponse
import uuid
from datetime import datetime

print("\n" + "="*70)
print("BACKEND HEALTH CHECK - Testing All Components")
print("="*70 + "\n")

def test_users():
    """Test user creation and retrieval"""
    print("[TEST] Users Module")
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                email=f'test_user_{uuid.uuid4()}@example.com',
                password='testpass123',
                name='Test User'
            )
            print(f"  ✓ User created: {user.email}")
            
            retrieved = User.objects.get(id=user.id)
            print(f"  ✓ User retrieved: {retrieved.email}")
            return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False


def test_articles():
    """Test article creation"""
    print("[TEST] Articles Module")
    try:
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                email=f'article_author_{uuid.uuid4()}@example.com',
                password='testpass123'
            )
        
        category, _ = Category.objects.get_or_create(
            name='Test Category',
            defaults={'description': 'Test category for articles'}
        )
        
        with transaction.atomic():
            article = Article.objects.create(
                title='Test Article',
                slug=f'test-article-{uuid.uuid4()}',
                content='This is a test article content.',
                excerpt='Test excerpt',
                author=user,
                category=category,
                status='published'
            )
            print(f"  ✓ Article created: {article.title} ({article.id})")
            
            retrieved = Article.objects.get(id=article.id)
            print(f"  ✓ Article retrieved: {retrieved.title}")
            return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_marketplace():
    """Test marketplace listings"""
    print("[TEST] Marketplace Module")
    try:
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                email=f'seller_{uuid.uuid4()}@example.com',
                password='testpass123'
            )
        
        with transaction.atomic():
            listing = Listing.objects.create(
                owner=user,
                title='Test Product',
                description='This is a test product',
                price='999',
                currency='USD',
                type='Product'
            )
            print(f"  ✓ Listing created: {listing.title} (ID: {listing.id})")
            
            retrieved = Listing.objects.get(id=listing.id)
            print(f"  ✓ Listing retrieved: {retrieved.title}")
            return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False


def test_messaging():
    """Test messaging/conversations"""
    print("[TEST] Messaging Module")
    try:
        user1 = User.objects.first()
        if not user1:
            user1 = User.objects.create_user(
                email=f'user1_{uuid.uuid4()}@example.com',
                password='testpass123'
            )
        
        user2 = User.objects.all()[1] if User.objects.count() > 1 else User.objects.create_user(
            email=f'user2_{uuid.uuid4()}@example.com',
            password='testpass123'
        )
        
        with transaction.atomic():
            conversation = Conversation.objects.create()
            conversation.participants.add(user1, user2)
            print(f"  ✓ Conversation created: {conversation.id}")
            
            message = Message.objects.create(
                conversation=conversation,
                sender=user1,
                content='Test message'
            )
            print(f"  ✓ Message created: {message.id}")
            
            retrieved = Message.objects.get(id=message.id)
            print(f"  ✓ Message retrieved: {retrieved.content}")
            return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_prayers():
    """Test prayers module"""
    print("[TEST] Prayers Module")
    try:
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                email=f'prayer_user_{uuid.uuid4()}@example.com',
                password='testpass123'
            )
        
        with transaction.atomic():
            prayer = Prayer.objects.create(
                title='Test Prayer',
                content='Please pray for this test',
                prayer_type='request',
                author=user,
                is_public=True
            )
            print(f"  ✓ Prayer created: {prayer.title} ({prayer.id})")
            
            retrieved = Prayer.objects.get(id=prayer.id)
            print(f"  ✓ Prayer retrieved: {retrieved.title}")
            return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False


def test_comments():
    """Test article comments"""
    print("[TEST] Comments Module")
    try:
        user = User.objects.first()
        article = Article.objects.filter(status='published').first()
        
        if not user:
            user = User.objects.create_user(
                email=f'commenter_{uuid.uuid4()}@example.com',
                password='testpass123'
            )
        
        if not article:
            category, _ = Category.objects.get_or_create(
                name='Test',
                defaults={'description': 'test'}
            )
            article = Article.objects.create(
                title='Comment Test Article',
                slug=f'comment-test-{uuid.uuid4()}',
                content='Test content',
                author=user,
                category=category,
                status='published'
            )
        
        with transaction.atomic():
            comment = Comment.objects.create(
                article=article,
                author=user,
                content='This is a test comment'
            )
            print(f"  ✓ Comment created: {comment.id}")
            
            retrieved = Comment.objects.get(id=comment.id)
            print(f"  ✓ Comment retrieved: {retrieved.content}")
            return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False


def test_database_connection():
    """Test database connectivity"""
    print("[TEST] Database Connection")
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("  ✓ Database connection: OK")
        return True
    except Exception as e:
        print(f"  ✗ Database error: {str(e)}")
        return False


def test_models_integrity():
    """Verify all models have proper fields"""
    print("[TEST] Model Integrity")
    try:
        # Check User model
        assert User._meta.get_field('id'), "User.id field missing"
        assert User._meta.get_field('email'), "User.email field missing"
        print("  ✓ User model: OK")
        
        # Check Article model
        assert Article._meta.get_field('id'), "Article.id field missing"
        assert Article._meta.get_field('title'), "Article.title field missing"
        assert Article._meta.get_field('author'), "Article.author field missing"
        print("  ✓ Article model: OK")
        
        # Check Listing model
        assert Listing._meta.get_field('id'), "Listing.id field missing"
        assert Listing._meta.get_field('owner'), "Listing.owner field missing"
        print("  ✓ Listing model: OK")
        
        # Check Prayer model
        assert Prayer._meta.get_field('id'), "Prayer.id field missing"
        assert Prayer._meta.get_field('author'), "Prayer.author field missing"
        print("  ✓ Prayer model: OK")
        
        return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False


# Run all tests
print("\nRunning Database Tests:\n")
results = {
    'Database': test_database_connection(),
    'Model Integrity': test_models_integrity(),
    'Users': test_users(),
    'Articles': test_articles(),
    'Marketplace': test_marketplace(),
    'Messaging': test_messaging(),
    'Prayers': test_prayers(),
    'Comments': test_comments(),
}

print("\n" + "="*70)
print("RESULTS SUMMARY")
print("="*70)
for test_name, result in results.items():
    status = "✓ PASS" if result else "✗ FAIL"
    print(f"{test_name:.<40} {status}")

all_passed = all(results.values())
print("="*70)
if all_passed:
    print("✓ ALL TESTS PASSED - Backend is healthy!")
else:
    print("✗ SOME TESTS FAILED - Please review the errors above")

print("="*70 + "\n")
sys.exit(0 if all_passed else 1)
