import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from marketplace.models import Listing

# Use actual existing images
listing1 = Listing.objects.get(id=1)
listing1.image = 'marketplace/1WF-SUNDRESS-6-FLORAL-67-BLU-OS_2__77876.1683341597-544184084.jpg'
listing1.save()

listing2 = Listing.objects.get(id=2)
listing2.image = 'articles/2025/11/12/R.jpeg'
listing2.save()

listing3 = Listing.objects.get(id=3)
listing3.image = 'message_attachments/2025/12/13/Gemini_Generated_Image_nptzx2nptzx2nptz.png'
listing3.save()

print("✓ Images updated to existing files!")
for l in Listing.objects.all():
    print(f"  {l.id}: {l.title}")
    print(f"     Image: {l.image}")
