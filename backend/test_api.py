#!/usr/bin/env python
"""
Test the API endpoints for likes and comments
"""
import requests
import json
import os

# Get an auth token from a test user
BASE_URL = 'http://localhost:8000'
DJANGO_API = f'{BASE_URL}/api'

# First, let's just check that the endpoints exist and respond correctly
def test_endpoints():
    print("Testing API endpoints...")
    
    # Get articles list
    response = requests.get(f'{DJANGO_API}/articles/')
    print(f"GET /api/articles/ - Status: {response.status_code}")
    
    if response.ok:
        articles = response.json()
        if isinstance(articles, list) and len(articles) > 0:
            article = articles[0]
            article_id = article['id']
            print(f"\nUsing article: {article['title']} (ID: {article_id})")
            
            # Check if the article includes likes_count, user_liked, and comments
            print(f"Article has likes_count: {'likes_count' in article}")
            print(f"Article has user_liked: {'user_liked' in article}")
            print(f"Article has comments: {'comments' in article}")
            
            if 'likes_count' in article:
                print(f"  likes_count: {article['likes_count']}")
            if 'user_liked' in article:
                print(f"  user_liked: {article['user_liked']}")
            if 'comments' in article:
                print(f"  comments: {len(article['comments'])} comments")
        else:
            print("No articles found")
    else:
        print(f"Error: {response.text}")

if __name__ == '__main__':
    test_endpoints()
