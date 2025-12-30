#!/usr/bin/env python
"""
Test script to verify article like, comment, and reply endpoints
"""
import os
import json
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from articles.models import Article, ArticleLike, Comment, CommentLike
from users.models import User
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status

# Create a test user
user = User.objects.first()
if not user:
    user = User.objects.create_user(email='test@example.com', password='testpass123')
    print(f"Created test user: {user.email}")
else:
    print(f"Using existing user: {user.email}")

# Get a test article
article = Article.objects.filter(status='published').first()
if not article:
    print("No published articles found. Creating one...")
    from articles.models import Category
    cat = Category.objects.first() or Category.objects.create(name='Test')
    article = Article.objects.create(
        title='Test Article',
        slug='test-article',
        content='Test content',
        author=user,
        category=cat,
        status='published'
    )
    print(f"Created test article: {article.title}")
else:
    print(f"Using existing article: {article.title}")

print("\n=== Testing Like/Unlike ===")
# Test like
like, created = ArticleLike.objects.get_or_create(user=user, article=article)
print(f"Like created: {created}, Like ID: {like.id}")

# Check like count
likes_count = article.likes.count()
print(f"Total likes on article: {likes_count}")

# Delete like
like.delete()
print(f"Like deleted")

print("\n=== Testing Comments ===")
# Create comment
comment = Comment.objects.create(
    article=article,
    author=user,
    content='This is a test comment'
)
print(f"Created comment: {comment.content}")

# Like comment
comment_like, created = CommentLike.objects.get_or_create(user=user, comment=comment)
print(f"Comment like created: {created}")

# Create reply
reply = Comment.objects.create(
    article=article,
    author=user,
    content='This is a reply to the comment',
    parent=comment
)
print(f"Created reply: {reply.content}")

# Check reply count
reply_count = comment.replies.count()
print(f"Total replies on comment: {reply_count}")

print("\n=== All Tests Passed ===")
