# Marketplace Fetch Error - Troubleshooting & Fix

## Problem
```
Error loading listings
Failed to fetch
Please make sure the backend server is running and accessible at https://godlywomenn.onrender.com marketplace
```

## Root Cause
The frontend cannot fetch marketplace listings because:
1. `NEXT_PUBLIC_DJANGO_API` environment variable is not correctly set in production
2. CORS is not properly configured to allow requests from the frontend domain
3. The backend server may not be running on Render

## Solution Checklist

### Step 1: Verify Backend is Running on Render
- [ ] Go to https://dashboard.render.com
- [ ] Click on your backend service (`godlywomenn`)
- [ ] Check the status - it should show "Live"
- [ ] If stopped, click "Manual Deploy" to restart it
- [ ] Check the logs for any errors

### Step 2: Verify Environment Variables on Render Backend
Set these environment variables in Render dashboard for the backend service:

| Variable | Value |
|----------|-------|
| `DEBUG` | `False` |
| `DJANGO_SECRET_KEY` | Generate with: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` |
| `ALLOWED_HOSTS` | `godlywomenn.onrender.com,localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | `https://godlywomenn.onrender.com` (or your frontend URL) |
| `DATABASE_URL` | (Should be auto-set by PostgreSQL plugin) |

### Step 3: Verify Environment Variables on Render Frontend
Set these environment variables in Render dashboard for the frontend service:

| Variable | Value |
|----------|-------|
| `NEXTAUTH_URL` | `https://godlywomenn.onrender.com` |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `https://godlywomenn.onrender.com` |
| `NEXT_PUBLIC_DJANGO_API` | `https://godlywomenn.onrender.com` |

### Step 4: Test Backend Accessibility
Run in terminal or browser:
```bash
# Test if backend is accessible
curl https://godlywomenn.onrender.com/api/marketplace/

# Or in browser, visit:
https://godlywomenn.onrender.com/api/marketplace/
```

Should return JSON array of marketplace items or an error message, NOT a connection error.

### Step 5: Clear Cache & Rebuild
After setting environment variables:

1. **Redeploy Frontend:**
   - Go to Render frontend service dashboard
   - Click "Manual Deploy"
   - Wait for build to complete

2. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click refresh icon
   - Select "Empty cache and hard refresh"

3. **Check Console Errors:**
   - Open DevTools
   - Go to Console tab
   - Look for any fetch errors with full URL

## Debugging Steps

### Check Frontend Logs
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for request to `/api/marketplace`
5. Check the request URL - should be `https://godlywomenn.onrender.com/api/marketplace/`
6. Check response - should show error message (not connection error)

### Check Backend Logs on Render
1. Go to backend service dashboard
2. Click "Logs" 
3. Look for any 500 errors or connection issues
4. Check if requests are even reaching the backend

## Common Issues

### Issue: Backend Returns 502 Bad Gateway
- **Cause:** Backend service crashed or out of memory
- **Fix:** Restart service with "Manual Deploy" button

### Issue: CORS Error in Console
- **Cause:** `CORS_ALLOWED_ORIGINS` not set correctly
- **Fix:** Update `CORS_ALLOWED_ORIGINS` to include frontend domain

### Issue: 404 Not Found on `/api/marketplace/`
- **Cause:** Django URLs not configured correctly
- **Check:** Backend `urls.py` includes marketplace routes

### Issue: Connection Timeout
- **Cause:** Backend service taking too long to respond
- **Fix:** Check backend logs, may need to optimize queries

## Code Changes Made

### Backend Settings (settings_production.py)
Updated CORS configuration to handle whitespace in comma-separated domains:
```python
# Before:
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')

# After:
CORS_ALLOWED_ORIGINS_SETTING = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,https://godlywomenn.onrender.com')
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_SETTING.split(',')]
```

This ensures that whitespace around domain names doesn't cause CORS validation to fail.

## Quick Commands for Local Testing

### Test local backend
```bash
cd backend
python manage.py runserver 8000
```

### Test marketplace endpoint
```bash
curl http://localhost:8000/api/marketplace/
```

### Set test env vars locally
```bash
export NEXT_PUBLIC_DJANGO_API=http://localhost:8000
export NEXT_PUBLIC_APP_URL=http://localhost:3000
npm run dev
```

## References
- [Render Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- [CORS Configuration](./backend/backend_project/settings_production.py)
- [Marketplace API Routes](./src/app/api/marketplace/route.ts)
