#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from marketplace.models import Listing
from users.models import User

print("=" * 60)
print("MARKETPLACE LISTINGS AND OWNERS")
print("=" * 60)

listings = Listing.objects.all()
print(f"\nTotal Listings: {listings.count()}\n")

for listing in listings:
    print(f"Listing ID: {listing.id}")
    print(f"  Title: {listing.title}")
    print(f"  Owner ID: {listing.owner.id}")
    print(f"  Owner Email: {listing.owner.email}")
    print(f"  Image: {listing.image}")
    print()

print("=" * 60)
print("ALL USERS")
print("=" * 60)

users = User.objects.all()
for user in users:
    print(f"User ID: {user.id}, Email: {user.email}")

print("\n" + "=" * 60)
