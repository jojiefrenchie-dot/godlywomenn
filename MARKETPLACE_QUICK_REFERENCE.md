# Marketplace Quick Reference

## Running the Marketplace

### Start the Backend
```bash
cd backend
.\.venv\Scripts\Activate  # or source .venv/bin/activate on Linux
python manage.py runserver 8000
```

### Start the Frontend
```bash
npm run dev
# Ensure NEXTAUTH_SECRET is set in environment
```

---

## Marketplace URLs

**Frontend:**
- Home: http://localhost:3000/marketplace
- View Listing: http://localhost:3000/marketplace/{id}
- Dashboard: http://localhost:3000/dashboard/marketplace

**Backend API:**
- List/Create: http://127.0.0.1:8000/api/marketplace/
- Retrieve/Update/Delete: http://127.0.0.1:8000/api/marketplace/{id}/

---

## How to Create a Listing

1. Go to http://localhost:3000/dashboard/marketplace
2. Click "Create Listing"
3. Fill in:
   - Title (required)
   - Type (Product/Service/Event)
   - Price
   - Currency
   - WhatsApp Contact (select country + number)
   - Description (or use AI to generate)
   - Image (optional - drag/drop or click)
4. Click "Save"
5. Image will be uploaded to `/media/marketplace/`

---

## How to Edit a Listing

1. Go to http://localhost:3000/dashboard/marketplace
2. Find your listing
3. Click "Edit"
4. Modify fields as needed
5. To change image: Select new image
6. To remove image: Click "Remove current image"
7. Click "Save"

---

## How to Delete a Listing

1. Go to http://localhost:3000/dashboard/marketplace
2. Find your listing
3. Click "Delete"
4. Confirm deletion

---

## Testing Photo Uploads

### Test Create with Image
```javascript
const formData = new FormData();
formData.append('title', 'Test Product');
formData.append('type', 'Product');
formData.append('price', '5000');
formData.append('currency', 'KSH');
formData.append('contact', '0712345678');
formData.append('countryCode', '+254');
formData.append('image', fileInput.files[0]);

const res = await fetch('http://127.0.0.1:8000/api/marketplace/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

### Test Image Display
```javascript
const listing = await fetch('http://127.0.0.1:8000/api/marketplace/1/').then(r => r.json());
console.log(listing.image); // Returns: "marketplace/2025/12/image.jpg"

// Frontend builds absolute URL:
const imageUrl = `http://127.0.0.1:8000/media/${listing.image}`;
```

### Test Image Clearing
```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('image', ''); // Empty string clears image

const res = await fetch('http://127.0.0.1:8000/api/marketplace/1/', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});
```

---

## Common Issues & Solutions

### Images not showing
**Check:**
1. Is DJANGO_API env var set correctly?
2. Are image files in `/media/marketplace/`?
3. Is Django serving media files?
4. Check browser console for failed image requests

**Fix:**
```bash
# Ensure media directory exists
mkdir -p backend/media/marketplace

# Check Django is serving media
# In settings.py: MEDIA_URL = '/media/' and MEDIA_ROOT should be set
```

### Upload failing
**Check:**
1. Is user authenticated? (Has valid JWT token)
2. Is Content-Type being set for FormData? (Should NOT be)
3. Is Authorization header being sent?
4. Check backend logs for detailed error

**Fix:**
```javascript
// Correct way to send FormData
const res = await fetch(url, {
  method: 'POST',
  // DON'T set Content-Type for FormData
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData // Browser will set multipart/form-data
});
```

### Database/Image sync issues
**Reset database and media:**
```bash
cd backend

# Delete database
rm db.sqlite3

# Delete media files
rm -rf media/*

# Run migrations
python manage.py migrate

# Create superuser if needed
python manage.py createsuperuser
```

---

## File Locations

**Frontend:**
- Pages: `src/app/marketplace/`
- Dashboard: `src/app/dashboard/marketplace/`
- Components: `src/app/components/`

**Backend:**
- Models: `backend/marketplace/models.py`
- Views: `backend/marketplace/views.py`
- Serializers: `backend/marketplace/serializers.py`
- URLs: `backend/marketplace/urls.py`
- Migrations: `backend/marketplace/migrations/`

**Media:**
- Uploaded images: `backend/media/marketplace/`

---

## Database Schema

### Listing Model
```python
class Listing:
    id: BigInt (Primary Key)
    owner: ForeignKey(User)
    title: CharField(255)
    description: TextField
    price: CharField(64)
    currency: CharField(10, choices=[...])
    type: CharField(16, choices=['Product', 'Service', 'Event'])
    contact: CharField(255)
    countryCode: CharField(4)
    image: ImageField(upload_to='marketplace/')
    date: DateTimeField (nullable)
    created_at: DateTimeField (auto)
    updated_at: DateTimeField (auto)
```

---

## Performance Tips

1. **Image Optimization:**
   - Compress images before upload
   - Use modern formats (WebP, AVIF)
   - Consider CDN for production

2. **Database:**
   - Add indexes on frequently searched fields
   - Use pagination for large listing sets
   - Cache popular listings

3. **Frontend:**
   - Use image lazy loading
   - Implement infinite scroll for listings
   - Cache listing data client-side

4. **Caching:**
   - Cache marketplace list (1-5 minutes)
   - Cache individual listings
   - Invalidate on updates

---

## Deployment Checklist

Before going to production:

- [ ] Set DEBUG = False
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up proper database (PostgreSQL recommended)
- [ ] Configure storage (S3/CloudFront for images)
- [ ] Enable HTTPS
- [ ] Set up media file serving (CDN)
- [ ] Configure CORS properly
- [ ] Set strong SECRET_KEY
- [ ] Set proper environment variables
- [ ] Test all CRUD operations
- [ ] Test image uploads
- [ ] Test image display
- [ ] Monitor error logs
- [ ] Set up backups

---

## Support

For issues:
1. Check browser console for errors
2. Check Django server logs
3. Check network tab in DevTools
4. Review error messages in UI
5. Check database logs

Generated: 2025-12-20
