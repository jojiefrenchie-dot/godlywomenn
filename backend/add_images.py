import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from marketplace.models import Listing

# Update listings with images
listing1 = Listing.objects.get(id=1)
listing1.image = 'marketplace/2025/12/15/1WF-SUNDRESS-6-FLORAL-67-BLU-OS_2__77876.169.jpeg'
listing1.save()

listing2 = Listing.objects.get(id=2)
listing2.image = 'marketplace/2025/12/12/R.jpeg'
listing2.save()

listing3 = Listing.objects.get(id=3)
listing3.image = 'marketplace/2025/12/13/test_image.png'
listing3.save()

print("✓ Images added to listings!")
for l in Listing.objects.all():
    print(f"  {l.id}: {l.title}")
    print(f"     Image: {l.image}")
