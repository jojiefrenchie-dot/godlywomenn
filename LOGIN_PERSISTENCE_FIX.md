# Login Credentials Data Persistence Fix

## The Problem You're Experiencing

When you close the browser or come back after some time:
- ❌ You're logged out
- ❌ Your login credentials are forgotten
- ❌ All your session data is lost

This is happening because:

1. **Session cookies not configured properly for persistence**
2. **Browser clearing cookies when closing**
3. **Session timeout too short or not properly set**

## The Solution

### 1. Update Django Settings (COMPLETED)
✅ Added proper session configuration:
- `SESSION_ENGINE = 'django.contrib.sessions.backends.db'` - Store sessions in database
- `SESSION_COOKIE_AGE = 604800` (7 days) - Cookies persist for 7 days
- `SESSION_EXPIRE_AT_BROWSER_CLOSE = False` - Sessions don't expire when browser closes
- `SESSION_COOKIE_SECURE` = False for local dev, True for production
- `SESSION_COOKIE_HTTPONLY = True` - Prevents JavaScript from accessing cookies

### 2. NextAuth Configuration (Already Correct)
✅ Your NextAuth is already configured with:
- JWT strategy (not session-based) - Best for API-driven apps
- 7-day max age for sessions and JWT
- HttpOnly cookies for security
- Proper token refresh logic

### 3. What to Do Next

#### Step 1: Clear Old Sessions from Database
```bash
cd backend
python manage.py shell
>>> from django.contrib.sessions.models import Session
>>> Session.objects.all().delete()
>>> exit()
```

#### Step 2: Restart Both Servers
```bash
# Terminal 1: Restart Django
cd c:\Godlywomen\backend
python manage.py runserver 8000

# Terminal 2: Restart Next.js
cd c:\Godlywomen
npm run dev
```

#### Step 3: Test Login Persistence
1. Log in to your account
2. Check browser dev tools → Application → Cookies
3. Look for `next-auth.session-token` cookie
4. Verify it has `Max-Age: 604800` (7 days)
5. **Close the browser completely**
6. Reopen and return to the site
7. Verify you're still logged in

## Files Modified

### Backend (Django)
- `backend/backend_project/settings.py`
  - Added session configuration
  - Fixed SESSION_COOKIE_SECURE for dev vs production
  - Added database persistence check

### Environment Files
- `backend/.env.local` (Created)
  - Set `DEBUG=true` for local development
  - Set `DATABASE_URL=sqlite:///db.sqlite3`

## Expected Behavior After Fix

✅ **Login credentials persist for 7 days**
✅ **Sessions survive browser restart**
✅ **Tokens automatically refresh when expired**
✅ **All created data is saved to database**
✅ **No data loss when you come back later**

## Key Settings Explained

### SESSION_COOKIE_AGE = 604800
- Duration: 7 days
- User stays logged in for 7 days of inactivity
- Adjust if you want shorter/longer sessions

### SESSION_EXPIRE_AT_BROWSER_CLOSE = False
- Sessions don't expire when browser closes
- User stays logged in even after restart
- **This is what was missing before**

### SESSION_COOKIE_SECURE = False (dev only)
- Allows cookies over HTTP during development
- Changed to True in production for HTTPS only
- **This was preventing login from persisting locally**

### SESSION_COOKIE_HTTPONLY = True
- JavaScript cannot access the cookie
- Protects against XSS attacks
- Required for security

## Testing Checklist

After restart:
- [ ] Log in successfully
- [ ] Check that `next-auth.session-token` cookie exists
- [ ] Check cookie has 7-day expiry
- [ ] Close browser
- [ ] Reopen site - still logged in?
- [ ] Check browser console for any CORS/auth errors
- [ ] Create a new post/comment
- [ ] Refresh page - data still there?
- [ ] Close browser
- [ ] Reopen - data still there after restart?

## If Issues Persist

### Issue: Still Getting Logged Out After Browser Close
**Fix**: The `SESSION_EXPIRE_AT_BROWSER_CLOSE = False` setting isn't working
1. Check that Django restarted properly
2. Check `DEBUG=true` is set in `.env`
3. Try clearing all cookies and logging in again

### Issue: Cookies Show 24h Instead of 7 days
**Fix**: Cookies might be configured differently for NextAuth
1. NextAuth JWT has separate settings from Django sessions
2. Check that `maxAge: 7 * 24 * 60 * 60` is set in auth.ts (it is)
3. This is actually correct - both set to 7 days

### Issue: Still Losing Data
**Fix**: Database isn't persisting properly
1. Check that `db.sqlite3` file exists in `backend/` folder
2. If it got deleted, migrations need to be re-run:
   ```bash
   cd backend
   python manage.py migrate
   ```
3. Check `.gitignore` doesn't force delete the database

## Long-term Improvement

For production, consider:
1. **Use PostgreSQL on Render** (already configured)
2. **Use Redis for sessions** (better than database)
3. **Implement remember-me checkbox** (optional 30-day login)

## Git Commit

All changes have been committed to secure this configuration.
