# Sign-In & Registration Troubleshooting Checklist

## If Testing Locally (http://localhost:3000):

### Step 1: Verify Django Backend is Running
```bash
# Terminal 1: Start Django backend
cd backend
.venv\Scripts\python.exe manage.py runserver 8000
```

Then visit: `http://localhost:8000/` - you should see the API index page

### Step 2: Verify Frontend is Running
```bash
# Terminal 2: Start Next.js frontend
npm run dev
```

Then visit: `http://localhost:3000`

### Step 3: Check Environment Variables
The `.env` file should have:
```
NEXT_PUBLIC_DJANGO_API=http://localhost:8000
DJANGO_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<any-secure-string>
```

### Step 4: Test Django Endpoints Directly

Open browser and test these:

1. **Check if Django is running:**
   - http://localhost:8000/health/

2. **Try to register (via Postman or curl):**
   ```bash
   curl -X POST http://localhost:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
   ```

3. **Try to login:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/token/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'
   ```

### Step 5: Check Browser Console
1. Go to http://localhost:3000
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. Try to sign up/login
5. Look for error messages

### Step 6: Check Frontend Logs
Look at the terminal running `npm run dev` for any error messages

---

## If Testing on Render:

1. **Make sure you added SECRET_KEY** to environment variables
2. **Check Render backend logs** - go to service → Logs
3. **Update frontend environment** for Render URL:
   - `NEXT_PUBLIC_DJANGO_API=https://your-backend-service.render.com`

---

## Common Issues:

| Error | Solution |
|-------|----------|
| "Network error" or "Failed to fetch" | Django backend not running or wrong URL in env |
| "Invalid credentials" | User doesn't exist or password wrong |
| "CSRF token missing" | Check CORS_ALLOWED_ORIGINS in Django settings |
| "JWT token error" | Check NEXTAUTH_SECRET is set |
| "Cannot POST /api/auth/token/" | Django endpoint not found (check URLs) |

---

## What I Need From You:

1. **Exact error message** shown on screen when you try to sign in
2. **Are you testing locally or on Render?**
3. **Check browser console (F12)** - what does it say?
4. **Is Django backend running?** (Check if http://localhost:8000 works)
