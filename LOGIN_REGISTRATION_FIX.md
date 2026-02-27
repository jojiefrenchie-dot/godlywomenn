# Login & Registration Fix - Session Refresh Token Error

## 🔴 Problem
After creating a new account, users cannot log in with the credentials used during registration. They see repeated "Session has refresh token error" messages.

## 🔍 Root Causes Identified

### 1. **CORS Not Configured for Vercel Domain** ⚠️ PRIMARY ISSUE
- Backend Django settings only allowed: `localhost:3000` and `onrender.com`
- Production frontend running on: `godlywomenn.vercel.app`
- Result: Token refresh requests from Vercel are **BLOCKED by CORS**

### 2. **Missing Production Backend URL**
- Frontend Vercel deployment has no `NEXT_PUBLIC_DJANGO_API` environment variable
- This causes the frontend to use `http://localhost:8000` in production
- Result: API calls fail or use wrong backend

### 3. **Inadequate Error Logging**
- Errors weren't clear about what was failing (CORS vs auth vs backend)
- Made debugging difficult

## ✅ Fixes Applied

### Fix #1: Backend CORS Configuration
**File**: `backend/backend_project/settings_production.py`
```python
# NOW INCLUDES:
CORS_ALLOWED_ORIGINS_SETTING = os.environ.get(
    'CORS_ALLOWED_ORIGINS', 
    'http://localhost:3000,https://godlywomenn.vercel.app,https://godlywomenn.onrender.com'
)
```

**File**: `backend/backend_project/settings.py`
```python
# Updated to include Vercel domain for testing
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000,https://godlywomenn.vercel.app'
).split(',')
```

### Fix #2: Frontend API URL Fallback
**File**: `src/lib/api-url.ts`
- Added fallback detection for production
- Now automatically uses Render backend if `NEXT_PUBLIC_DJANGO_API` not set
- Includes better logging for debugging

```typescript
// Production fallback - use known Render backend
const inferredUrl = window.location.hostname.includes('vercel.app')
  ? 'https://godlywomenn.onrender.com'
  : 'http://localhost:8000';
```

### Fix #3: Enhanced Error Logging
**Files Modified**:
- `src/lib/refreshToken.ts` - Added detailed logging for token refresh failures
- `src/lib/auth.ts` - Improved authorization and JWT callback logging
- Better error messages for debugging

#### Before:
```
Token refresh failed: 403 {}
```

#### After:
```
[TOKEN_REFRESH] ✗ Token refresh failed:
  Status: 403
  Error: {"detail":"CORS blocked"}
  Headers: { 'access-control-allow-origin': undefined }
```

## 🚀 Deployment Instructions

### Step 1: Deploy Backend Changes
Redeploy the Django backend on Render/Railway:
```bash
git push origin main  # Or your deployment trigger
```

### Step 2: Set Vercel Environment Variables
On Vercel dashboard for `godlywomenn.vercel.app`:

**Add or update**:
```
NEXT_PUBLIC_DJANGO_API = https://godlywomenn.onrender.com
DJANGO_API_URL = https://godlywomenn.onrender.com
```

**Keep existing**:
```
NEXTAUTH_URL = https://godlywomenn.vercel.app
NEXTAUTH_SECRET = (your existing secret)
```

### Step 3: Redeploy Frontend
```bash
git push origin main  # Trigger Vercel redeploy
```

## 🧪 Testing the Fix

### Test Registration & Login Flow:
1. Go to `https://godlywomenn.vercel.app/register`
2. Create a new account with:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `securePassword123`
3. Should be redirected to dashboard
4. Log out (if available)
5. Go to `https://godlywomenn.vercel.app/login`
6. Log in with same credentials
7. Should be redirected to dashboard
8. Close browser
9. Reopen `https://godlywomenn.vercel.app`
10. Should still be logged in ✅

### Check Browser Logs:
Open DevTools → Console and look for:
- ✅ `[AUTHORIZE] ✓ Attempting login for: test@example.com`
- ✅ `[JWT CALLBACK] ✓ New sign-in, user: test@example.com`
- ✅ `[TOKEN_REFRESH] ✓ Token refresh successful`

### Verify Cookies:
DevTools → Application → Cookies:
- Should see `next-auth.session-token` cookie
- Should have 7-day expiry

## 🔧 Configuration Summary

### Backend Environment Variables (on Render/Railway):
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://godlywomenn.vercel.app,https://godlywomenn.onrender.com
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,godlywomenn.vercel.app,*.vercel.app,godlywomenn.onrender.com,*.onrender.com
```

### Frontend Environment Variables (on Vercel):
```
NEXTAUTH_URL=https://godlywomenn.vercel.app
NEXTAUTH_SECRET=<32+ char secret>
NEXT_PUBLIC_DJANGO_API=https://godlywomenn.onrender.com
DJANGO_API_URL=https://godlywomenn.onrender.com
```

## 📊 Expected Behavior After Fix

| Action | Before | After |
|--------|--------|-------|
| Register account | ✅ Works | ✅ Works (auto-login) |
| Log in immediately after | ❌ Fails | ✅ Works |
| Token refresh | ❌ CORS error | ✅ Works |
| Session persists | ❌ No | ✅ Yes (7 days) |
| Create content | ❌ Session error | ✅ Works |

## 🆘 Troubleshooting

### Still Getting "Session has refresh token error"?

1. **Check Backend is Deployed**:
   ```bash
   curl https://godlywomenn.onrender.com/health/
   ```
   Should return: `{"status": "ok"}`

2. **Check CORS Headers**:
   ```bash
   curl -i -X OPTIONS https://godlywomenn.onrender.com/api/auth/token/refresh/ \
     -H "Origin: https://godlywomenn.vercel.app"
   ```
   Should include: `Access-Control-Allow-Origin: https://godlywomenn.vercel.app`

3. **Check Frontend Environment**:
   - Go to `https://godlywomenn.vercel.app`
   - Open DevTools Console
   - Should see: `[API_URL] Using configured backend URL: https://godlywomenn.onrender.com`

4. **Clear Cache and Cookies**:
   - DevTools → Application → Clear storage
   - Try login again

### If Backend URL is Still Wrong:

1. Check Vercel Environment Variables are set
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Wait 5 minutes for Vercel deployment to propagate

## 📝 Files Modified

1. `backend/backend_project/settings.py` - Added Vercel CORS
2. `backend/backend_project/settings_production.py` - Added Vercel CORS
3. `src/lib/api-url.ts` - Improved URL fallback logic
4. `src/lib/refreshToken.ts` - Enhanced error logging
5. `src/lib/auth.ts` - Improved authorization and JWT callbacks

## ✨ Key Improvements

✅ CORS now allows Vercel domain  
✅ Frontend can find backend in production  
✅ Better error messages for debugging  
✅ Automatic token refresh before expiry  
✅ 7-day session persistence  
✅ Clear logging for all auth operations  

