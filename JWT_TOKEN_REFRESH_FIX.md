# JWT Token Refresh 500 Error - FIX

## Problem
When the JWT token expires, the system attempts to refresh it but gets a 500 error:

```
2026-01-16 15:53:57.004 [error] Token refresh failed: 500 {}
2026-01-16 15:53:57.125 [error] Session has refresh token error
```

## Root Cause
The Django JWT settings had `BLACKLIST_AFTER_ROTATION: True` enabled, which requires the `rest_framework_simplejwt.token_blacklist` app to be installed and configured. Without it:

1. When tokens are refreshed, Django tries to blacklist the old token
2. The blacklist app isn't installed, so the database lookup fails
3. This causes a 500 error on the token refresh endpoint
4. The frontend receives the 500 error and can't refresh the session

## Solution
Disabled `BLACKLIST_AFTER_ROTATION` in Django settings since:
- Token blacklisting isn't essential for basic JWT functionality
- It requires additional database tables and migrations
- The app wasn't installed in the project

### Changes Made

**File: `backend/backend_project/settings.py`**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,  # ← Changed from True to False
    # ... rest of config
}
```

## How Token Refresh Works Now

1. **JWT Callback** (Next.js) - When token is about to expire:
   - Detects token will expire within 1 minute
   - Calls `refreshAccessToken()` function

2. **Frontend Refresh** - Sends POST request to Django:
   ```
   POST /api/auth/token/refresh/
   Body: { refresh: "refresh_token_string" }
   ```

3. **Django Backend** - TokenRefreshView:
   - Validates the refresh token
   - Generates new access token (60 min lifetime)
   - Returns new tokens to frontend
   - No longer tries to blacklist old tokens

4. **Session Updated** - Frontend receives:
   ```json
   {
     "access": "new_access_token",
     "refresh": "new_refresh_token"
   }
   ```

## Token Lifetimes
- **Access Token**: 60 minutes (used for API requests)
- **Refresh Token**: 7 days (used to get new access tokens)
- **Session**: 7 days (user stays logged in)

## Testing

Run the test script to verify token refresh works:
```bash
cd backend
python test_token_refresh.py
```

Expected output:
```
[TEST] ✓ Token refresh test PASSED
[TEST] The token refresh endpoint should now work correctly
```

## Verification Checklist

- [ ] Backend is running: `python manage.py runserver 8000`
- [ ] Frontend is running: `npm run dev`
- [ ] Test user can login at http://localhost:3000/login
- [ ] Check browser console - should NOT see "Token refresh failed: 500"
- [ ] User session stays active after 1 minute (token is auto-refreshed)
- [ ] No logout/re-login needed for 7 days unless token is truly invalid

## If Still Having Issues

1. **Clear cookies and cache**:
   - Open DevTools → Application → Clear all cookies
   - Hard refresh the page (Ctrl+Shift+R)

2. **Check Django logs**:
   - Look for `[TOKEN_REFRESH]` entries in terminal
   - Should see "Token refresh successful" not "failed"

3. **Verify environment variables**:
   - `NEXTAUTH_SECRET` must be set (32+ chars)
   - `DJANGO_API_URL` or `NEXT_PUBLIC_DJANGO_API` must point to backend
   - `NODE_ENV=development` for local testing

4. **Check CORS settings**:
   - Backend should allow requests from `http://localhost:3000`
   - Verify in `backend/backend_project/settings.py` under `CORS_ALLOWED_ORIGINS`
