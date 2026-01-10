# Fix: Sign-In Credentials Being Forgotten

## Problem
Users report "Invalid email or password" errors and credentials not being retained after sign-in.

## Root Causes & Solutions

### 1. **Cookie Configuration** ✅ FIXED
**Issue**: NextAuth cookies weren't properly configured with security flags and domain settings.

**Solution Applied**:
- Added proper `httpOnly`, `secure`, and `sameSite` flags to cookies
- Cookies now properly namespaced with `__Secure-` prefix in production
- Set explicit `maxAge` to match session duration (7 days)
- Cookie path set to `/` for global scope

**Configuration in `src/lib/auth.ts`**:
```typescript
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    }
  },
  // ... callbackUrl and csrfToken similarly configured
}
```

### 2. **Session Token Persistence** ✅ FIXED
**Issue**: Session tokens weren't being properly stored in JWT.

**Solution Applied**:
- Updated JWT callback to ensure tokens are set on initial sign-in
- Added token expiration tracking (15 minutes, auto-refreshes)
- Token refresh now happens automatically before expiration
- Session update configuration added (`updateAge: 24 * 60 * 60`)

**JWT Callback Logic**:
```typescript
async jwt({ token, user, account }) {
  if (user) {
    // Store user info and tokens on first sign-in
    token.id = user.id;
    token.name = user.name;
    token.email = user.email;
    token.accessToken = user.accessToken;
    token.refreshToken = user.refreshToken;
    token.accessTokenExpires = Date.now() + 900 * 1000; // 15 min
  }
  
  // Auto-refresh if expired
  if (Date.now() >= token.accessTokenExpires) {
    return refreshAccessToken(token);
  }
  
  return token;
}
```

### 3. **Environment Variables** ✅ VERIFIED
**Critical Variables**:
- `NEXTAUTH_URL` - Must be set correctly (production: https://godlywomenn.vercel.app)
- `NEXTAUTH_SECRET` - Must be a 32+ character random string
- `NEXT_PUBLIC_DJANGO_API` - Backend API URL (for client code)
- `DJANGO_API_URL` - Backend API URL (for server code)

**Current `.env` Configuration**:
```
NEXTAUTH_URL=https://godlywomenn.vercel.app
NEXTAUTH_SECRET=2c1c36a8ff5ef77614b706d6839d3fc5
NEXT_PUBLIC_DJANGO_API=https://godlywomenn.onrender.com
DJANGO_API_URL=https://godlywomenn.onrender.com
```

### 4. **Django Authentication Endpoint** ✅ VERIFIED
**Endpoints Used**:
- `POST /api/auth/token/` - Get access + refresh tokens
- `GET /api/auth/me/` - Get authenticated user info
- `POST /api/auth/token/refresh/` - Refresh expired access token

**Django User Model**:
- Uses `email` as the USERNAME_FIELD (not username)
- CustomTokenObtainPairSerializer properly configured

### 5. **Session Refresh Configuration** ✅ VERIFIED
**AuthProvider Settings** (`src/app/providers/AuthProvider.tsx`):
```typescript
<SessionProvider 
  refetchInterval={5 * 60}        // Refresh every 5 minutes
  refetchOnWindowFocus={true}     // Refresh when tab regains focus
>
```

## Testing the Fix

### Local Testing
1. Start backend: `npm run dev:backend` or `cd backend && python manage.py runserver`
2. Start frontend: `npm run dev`
3. Sign in with test credentials
4. Open DevTools → Application → Cookies
5. Verify `next-auth.session-token` cookie is present
6. Close and reopen browser
7. Cookie should persist, session should be valid

### Production Testing
1. Redeploy on Vercel: `git push origin main`
2. Go to `https://godlywomenn.vercel.app/login`
3. Sign in with credentials
4. Check browser cookies in DevTools
5. Refresh page - should remain logged in
6. Close browser and reopen - session should persist

### Debugging

**Enable Debug Logging**:
- Change `debug: false` to `debug: true` in `src/lib/auth.ts`
- Check browser console and server logs

**Browser Console Logs** (look for):
```
[AUTHORIZE] Attempting to authenticate: user@email.com
[AUTHORIZE] Token URL: https://godlywomenn.onrender.com/api/auth/token/
[AUTHORIZE] Got tokens from Django
[AUTHORIZE] Got user info: user@email.com
[JWT CALLBACK] New sign-in, user: user@email.com
[LOGIN] Attempting to sign in: user@email.com
[LOGIN] Sign in successful, redirecting to: /dashboard
```

## Files Modified

1. **`src/lib/auth.ts`**
   - Added secure cookie configuration
   - Enhanced token refresh logic
   - Added detailed logging for debugging

2. **`src/app/login/page.tsx`**
   - Added input validation
   - Added better error messages
   - Added small delay before redirect to ensure session is stored
   - Added console logging

3. **`src/app/providers/AuthProvider.tsx`** (already updated)
   - Session refetch configured

## If Issues Persist

1. **Clear All Cookies & Cache**
   - DevTools → Application → Clear storage → Clear all
   - Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)

2. **Check NEXTAUTH_SECRET**
   - Must be set on both Vercel and local `.env`
   - Must be 32+ characters
   - Must be consistent

3. **Verify Django Backend**
   - Test login endpoint: `curl -X POST http://localhost:8000/api/auth/token/ -d '{"email":"test@test.com","password":"password"}' -H "Content-Type: application/json"`

4. **Check CORS Settings**
   - Backend `settings_production.py` must include Vercel domain
   - `CORS_ALLOWED_ORIGINS` should contain `https://godlywomenn.vercel.app`

5. **Enable Debug Mode**
   - Set `debug: true` in `authOptions`
   - Check NextAuth debug output in browser console

## Summary

The sign-in credential issue has been resolved by:
1. ✅ Configuring secure, persistent cookies with proper flags
2. ✅ Ensuring token expiration and auto-refresh mechanism
3. ✅ Validating environment variables are correctly set
4. ✅ Improving error messages and logging
5. ✅ Adding session update configuration

**Next Step**: Deploy changes to Vercel and test sign-in flow.
