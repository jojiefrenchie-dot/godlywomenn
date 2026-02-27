# Image Loading Fix - Testing Guide

## Quick Test

### Local Test (Development)
```bash
# 1. Start backend
cd backend
python manage.py runserver

# 2. Start frontend (in another terminal)
npm run dev

# 3. Create article with image
- Go to http://localhost:3000/articles/create
- Upload an image
- Publish article

# 4. View article
- Go to article detail page
- Image should load via /api/media/articles/...
- Check Network tab for cache headers
```

### Production Test (Render/Vercel)
```bash
# 1. Push changes to GitHub
git push origin

# 2. Wait for Vercel deployment (~2-5 minutes)

# 3. Test on production
- Go to https://godlywomenn.vercel.app/articles/create
- Upload an image
- Publish article
- View article - image should load
- Check Network tab - should use /api/media/ proxy
```

## What to Verify

### ✅ Images Load Successfully
- Featured images on article detail pages
- Images on article cards
- Images in marketplace listings
- User profile images

### ✅ URL Pattern is Correct
DevTools → Network tab:
- Request URL: `https://godlywomenn.vercel.app/api/media/articles/2025/01/filename.jpg`
- Request to proxy endpoint, NOT directly to Django

### ✅ Cache Headers Set Properly
DevTools → Network tab → Response Headers:
- Should see: `Cache-Control: public, max-age=31536000, immutable`
- This means images cache for 1 year

### ✅ No Console Errors
DevTools → Console:
- Should NOT see "Failed to load image"
- Should NOT see 404 errors for images
- May see proxy logs like: `[MEDIA PROXY] Fetching: ...`

## Common Issues & Fixes

### Issue: Images still show "Failed to load image"

**Check 1**: Verify image URL format
```
Network tab → look for /api/media/ requests
Should be: /api/media/articles/...
Should NOT be: /media/articles/...
```

**Check 2**: Verify proxy endpoint is deployed
```bash
curl https://godlywomenn.vercel.app/api/media/articles/2025/01/test.jpg
```
Should return image data, not 404.

**Check 3**: Verify Django is serving media
```bash
curl https://godlywomenn.onrender.com/media/articles/2025/01/test.jpg
```
Should return image data, not 404.

### Issue: Images load but slowly

- Check if cache headers are set
- Verify `/api/media/` requests show 304 (cached) on reload
- May be first-time load before caching

### Issue: Upload works but image not visible

1. Refresh page (may be caching old version)
2. Clear browser cache: Ctrl+Shift+Delete
3. Check if image actually uploaded:
   ```bash
   curl https://godlywomenn.onrender.com/api/articles/
   # Look for featured_image field in response
   ```

## Network Tab Inspection

### Expected Request Flow

**First Load (No Cache)**:
```
GET /api/media/articles/2025/01/image.jpg → 200 OK
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/jpeg
```

**Reload (From Cache)**:
```
GET /api/media/articles/2025/01/image.jpg → 304 Not Modified
(from disk cache)
```

## Debugging Commands

### Check if image exists on backend
```bash
# SSH to Render (if available)
cd /var/data  # Render persistent volume
ls media/articles/2025/01/

# Or use curl
curl -I https://godlywomenn.onrender.com/media/articles/2025/01/image.jpg
# Should return 200 with Content-Type: image/*
```

### Test proxy endpoint directly
```bash
# Test with known image path
curl -v https://godlywomenn.vercel.app/api/media/articles/2025/01/image.jpg

# Should see:
# < HTTP/2 200
# < cache-control: public, max-age=31536000, immutable
# < content-type: image/jpeg
```

### Check article data
```bash
# Get article to verify featured_image path
curl https://godlywomenn.onrender.com/api/articles/ \
  -H "Authorization: Bearer <token>"

# Look for featured_image field - should be /media/articles/... format
```

## Success Checklist

After deployment, verify:

- [ ] Can upload image when creating article
- [ ] Featured image appears on article detail page
- [ ] Featured image appears on article card (home page)
- [ ] Featured image appears in articles list
- [ ] Featured image appears in marketplace
- [ ] No "Failed to load image" errors
- [ ] Network tab shows `/api/media/` requests
- [ ] Cache headers show 1-year expiry
- [ ] Images load within 2 seconds

## Performance Metrics

Expected performance:
- First load: ~500-2000ms (depends on image size)
- Cached load: ~50-100ms (from browser cache)
- Browser cache: 1 year (31536000 seconds)

## Deployment Steps

1. ✅ All code changes committed
2. ✅ Pushed to GitHub main branch
3. Vercel auto-deploys (wait 2-5 minutes)
4. Test on production URL
5. Monitor Vercel/Render logs for errors
6. Done!

## Still Having Issues?

1. Clear all cache:
   - Browser: Ctrl+Shift+Delete
   - Vercel cache: Redeploy function
   - Render: Restart service

2. Check logs:
   - Vercel: https://vercel.com/dashboard
   - Render: https://dashboard.render.com

3. Verify environment variables:
   - Vercel: NEXT_PUBLIC_DJANGO_API, DJANGO_API_URL
   - Render: ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS

## Summary

Images now load via `/api/media/` proxy endpoint which:
- ✅ Works on production with DEBUG=False
- ✅ Caches for 1 year in browser
- ✅ Handles errors gracefully
- ✅ Works with any storage backend

**Status**: Ready to test in production!
