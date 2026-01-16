# 🚀 Login Fix - Deployment Checklist

## ✅ What Was Fixed

Your login issue was caused by **CORS blocking token refresh requests** from Vercel to the Django backend.

### The Problem in 3 Steps:
1. User creates account on Vercel ✅ (registration works)
2. User tries to log in ❌ (credentials fail)
3. Browser logs show: "Session has refresh token error" ❌

### The Root Cause:
- Backend CORS settings only allowed `localhost:3000` and `onrender.com`
- Your Vercel app (`godlywomenn.vercel.app`) was **BLOCKED**
- Token refresh requests failed silently
- Users got redirected to login loop

## 🔧 Files Changed (4 files)

### Backend (Django):
- ✅ `backend/backend_project/settings.py` - Added Vercel CORS
- ✅ `backend/backend_project/settings_production.py` - Added Vercel CORS

### Frontend (Next.js):
- ✅ `src/lib/api-url.ts` - Improved backend URL detection
- ✅ `src/lib/auth.ts` - Better error logging
- ✅ `src/lib/refreshToken.ts` - Detailed refresh logging

## 📋 Deployment Steps

### Step 1: Deploy Backend
Your backend needs the new CORS configuration.

**If on Railway/Render:**
```bash
# Just git push - auto-deploys with new settings
git add backend/backend_project/settings*.py
git commit -m "Fix: Add Vercel domain to CORS whitelist"
git push origin main
```

**Wait for deployment to complete (~2-5 minutes)**

### Step 2: Verify Backend Deployment
```bash
# Check backend is running and CORS is configured
curl -i -X OPTIONS https://godlywomenn.onrender.com/api/auth/token/ \
  -H "Origin: https://godlywomenn.vercel.app" \
  -H "Access-Control-Request-Method: POST"

# Should see header:
# access-control-allow-origin: https://godlywomenn.vercel.app
```

### Step 3: Set Vercel Environment Variables
1. Go to: https://vercel.com/dashboard
2. Find your `godlywomenn` project
3. Settings → Environment Variables
4. Add/Update these:

```
NEXT_PUBLIC_DJANGO_API = https://godlywomenn.onrender.com
DJANGO_API_URL = https://godlywomenn.onrender.com
```

### Step 4: Deploy Frontend
```bash
git add src/lib/
git commit -m "Fix: Improve auth logging and backend URL detection"
git push origin main
```

**Wait for Vercel deployment (~1-2 minutes)**

### Step 5: Test the Fix
1. Open https://godlywomenn.vercel.app/register
2. Create new account
3. Should go straight to dashboard
4. Go to /login
5. Log in with same credentials
6. Should work ✅

## 🧪 Verification Tests

### Test 1: Registration
```
1. Go to /register
2. Fill: Name, Email, Password
3. Click "Create Account"
4. Expected: Redirected to /dashboard
```

### Test 2: Login
```
1. Go to /login  
2. Enter credentials from Test 1
3. Click "Sign in"
4. Expected: Redirected to /dashboard
```

### Test 3: Session Persistence
```
1. Stay on dashboard for 30 seconds
2. Refresh the page (F5)
3. Expected: Still logged in
```

### Test 4: Browser Console Logs
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for success messages:
   ✅ [AUTHORIZE] ✓ Attempting login
   ✅ [JWT CALLBACK] ✓ New sign-in
   ✅ [TOKEN_REFRESH] ✓ Token refresh successful
```

## 🆘 If Issues Persist

### Issue: Still seeing "refresh token error"
**Check 1**: Backend is deployed
```bash
curl https://godlywomenn.onrender.com/health/
# Should return: {"status": "ok"}
```

**Check 2**: CORS is configured
```bash
curl -I -X OPTIONS https://godlywomenn.onrender.com/api/auth/token/refresh/ \
  -H "Origin: https://godlywomenn.vercel.app"
# Should see Access-Control-Allow-Origin header
```

**Check 3**: Vercel env vars are set
```
https://vercel.com/dashboard → Project → Settings → Environment Variables
Check NEXT_PUBLIC_DJANGO_API is present
```

**Check 4**: Clear cache
```
DevTools → Application → Clear storage → Clear all
Try login again
```

### Issue: "Invalid email or password"
1. Check you typed credentials correctly
2. Account might not exist - register first
3. Check backend is running

### Issue: Dashboard is blank
1. First check you're logged in (see session token in cookies)
2. Open DevTools Console and look for errors
3. Check backend is responding

## 📊 Success Indicators

After fix is deployed, you should see:

✅ Registration works and auto-logs in  
✅ Can log in with saved credentials  
✅ Session persists after page refresh  
✅ Console shows "[TOKEN_REFRESH] ✓ Token refresh successful"  
✅ CORS header allows Vercel domain  
✅ 7-day session cookie is set  

## 🔐 Security Notes

- All tokens are stored in `HttpOnly` cookies (secure)
- CORS is restricted to known domains only
- Refresh tokens rotate automatically
- Passwords never stored in browser

## 📞 Need Help?

If the fix doesn't work after deployment:

1. Check [LOGIN_REGISTRATION_FIX.md](./LOGIN_REGISTRATION_FIX.md) for detailed troubleshooting
2. Check backend logs for CORS or auth errors
3. Verify all environment variables are set correctly
4. Try clearing all browser data and cookies

