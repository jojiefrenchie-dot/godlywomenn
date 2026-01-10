# Testing Sign-In Credentials Fix - Quick Guide

## Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Test account created in database

## Create Test Account (if needed)

### Option 1: Using Django Shell
```bash
cd backend
python manage.py shell
```

```python
from users.models import User
user = User.objects.create_user(
    email='test@example.com',
    name='Test User',
    password='testpassword123'
)
user.save()
exit()
```

### Option 2: Using Register Page
1. Go to `http://localhost:3000/register`
2. Fill in form with:
   - Name: Test User
   - Email: test@example.com
   - Password: testpassword123
   - Confirm: testpassword123
3. Click "Create Account"

## Test Sign-In Flow

### Step 1: Clear Existing Session
1. Open DevTools (F12)
2. Go to Application → Cookies
3. Delete all `next-auth*` cookies
4. Delete `localhost` storage

### Step 2: Sign In
1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `testpassword123`
3. Click "Sign in"

### Step 3: Verify Cookies
**Expected Cookies** (in DevTools → Application → Cookies):
- ✅ `next-auth.session-token` - Should be present, contains JWT
- ✅ `next-auth.csrf-token` - CSRF protection
- ✅ `next-auth.callback-url` - Redirect URL

**Check Cookie Properties**:
- Domain: `localhost`
- Path: `/`
- Expires: ~7 days from now
- HttpOnly: ✅ Should be checked
- Secure: ❌ Should NOT be checked (localhost doesn't use HTTPS)
- SameSite: `Lax`

### Step 4: Test Session Persistence

**Test A: Page Reload**
1. After successful sign-in, you should see dashboard
2. Press F5 to refresh page
3. ✅ Should remain logged in (not redirected to login)
4. Check browser console for logs:
   ```
   [JWT CALLBACK] Token expired, attempting refresh
   ```

**Test B: New Tab**
1. Keep existing tab open
2. Open new tab to `http://localhost:3000/dashboard`
3. ✅ Should be logged in immediately
4. Check both tabs - session should sync

**Test C: Close & Reopen Browser**
1. After sign-in, close browser completely
2. Reopen and go to `http://localhost:3000`
3. ✅ Should go to dashboard (session persisted)
4. ✅ Check cookies are still present
5. ✅ Can use protected features without re-login

## Debug Logging

### Enable Detailed Logs
Open `src/lib/auth.ts` and change:
```typescript
debug: false,  // Change to: true
```

### Expected Console Output on Sign-In
```
[AUTHORIZE] Attempting to authenticate: test@example.com
[AUTHORIZE] Token URL: http://localhost:8000/api/auth/token/
[AUTHORIZE] Got tokens from Django
[AUTHORIZE] Got user info: test@example.com
[JWT CALLBACK] New sign-in, user: test@example.com
[JWT CALLBACK] Tokens set, expires in 15 minutes
[LOGIN] Attempting to sign in: test@example.com
[LOGIN] Sign in successful, redirecting to: /dashboard
```

### Check JWT Token Content
In DevTools Console:
```javascript
// Get session data
const session = await fetch('/api/auth/session').then(r => r.json());
console.log('Session:', session);
console.log('Access Token:', session.accessToken);
console.log('Refresh Token:', session.refreshToken);
console.log('Token Expires:', new Date(session.accessTokenExpires));
```

## Troubleshooting

### Issue: "Invalid email or password" Error

**Check 1: Verify Test Account**
```bash
cd backend
python manage.py shell
from users.models import User
user = User.objects.get(email='test@example.com')
print(user.email, user.name)
# Try login
from django.contrib.auth import authenticate
auth_user = authenticate(email='test@example.com', password='testpassword123')
print('Auth result:', auth_user)
exit()
```

**Check 2: Test Django API Directly**
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

Expected response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Issue: Credentials Forgotten After Sign-In

**Check Cookie Storage**:
1. DevTools → Application → Cookies
2. Filter for `localhost`
3. Should see `next-auth.session-token`
4. If missing, check browser settings:
   - Settings → Privacy → Cookies and site data → Allow all
   - Disable "Block third-party cookies" if set

**Check Session Endpoint**:
```bash
curl http://localhost:3000/api/auth/session
```

Expected response:
```json
{
  "user": {
    "email": "test@example.com",
    "name": "Test User"
  },
  "accessToken": "eyJ0eXAi...",
  "accessTokenExpires": 1704067200000,
  "refreshToken": "eyJ0eXAi..."
}
```

### Issue: Login Page Shows Blank Error

1. Open DevTools → Console
2. Look for any JavaScript errors
3. Check Network tab → `/api/auth/signin` request
4. Response should show error message in `error` field

## Performance Checks

### Token Refresh Performance
1. Sign in successfully
2. Wait 15 minutes (or simulate in DevTools by modifying `accessTokenExpires`)
3. Perform an action requiring auth
4. ✅ Should auto-refresh token silently
5. Check console for `[JWT Callback] Token expired, attempting refresh`

### Session Sync Across Tabs
1. Sign in on Tab A
2. Open Tab B to same app
3. ✅ Both tabs should show user as logged in
4. Session info should be identical
5. `refetchInterval={5 * 60}` ensures 5-minute sync

## Success Criteria

- ✅ Can sign in with valid credentials
- ✅ Redirects to `/dashboard` after sign-in
- ✅ Session persists on page refresh
- ✅ Session persists across browser tabs
- ✅ Session persists after closing and reopening browser
- ✅ Cookies have correct security flags
- ✅ Token auto-refreshes before expiration
- ✅ Logout clears session and cookies
- ✅ Invalid credentials show error message
- ✅ Error messages are helpful and clear

## Next: Deploy to Production

Once local testing passes:
1. Run: `git push origin`
2. Vercel auto-deploys on push
3. Test on `https://godlywomenn.vercel.app`
4. Monitor error logs in Vercel dashboard
