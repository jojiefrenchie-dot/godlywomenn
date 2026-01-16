# 🎯 QUICK ACTION ITEMS - Login Fix

## The Problem
❌ After creating new account, can't log in  
❌ Getting "Session has refresh token error"  
❌ Only works if you create account, not if you login

## The Solution
✅ Added Vercel domain to backend CORS whitelist  
✅ Improved backend URL detection for frontend  
✅ Better error logging for debugging

## What You Need To Do (5 minutes)

### Step 1: Deploy Backend (1 min)
```bash
git add backend/backend_project/settings*.py
git commit -m "Fix: Add Vercel to CORS whitelist"
git push origin main
# Then wait 2-5 minutes for Railway/Render to redeploy
```

### Step 2: Add Environment Variables to Vercel (2 min)
Go to: https://vercel.com → Dashboard → Your Project → Settings → Environment Variables

**Add these two:**
```
NEXT_PUBLIC_DJANGO_API = https://godlywomenn.onrender.com
DJANGO_API_URL = https://godlywomenn.onrender.com
```

Click "Save" and redeploy

### Step 3: Deploy Frontend (1 min)
```bash
git add src/lib/
git commit -m "Fix: Improve auth and backend URL detection"
git push origin main
# Wait 1-2 minutes for Vercel to redeploy
```

### Step 4: Test (1 min)
1. Go to https://godlywomenn.vercel.app/register
2. Create account
3. Go to /login
4. Log in with same credentials
5. Should work ✅

## 🧾 Files Changed

**Backend:**
- `backend/backend_project/settings.py`
- `backend/backend_project/settings_production.py`

**Frontend:**
- `src/lib/api-url.ts`
- `src/lib/auth.ts`
- `src/lib/refreshToken.ts`

## ❓ Still Not Working?

### Check 1: Backend Deployed?
```bash
curl https://godlywomenn.onrender.com/health/
```
Should return `{"status": "ok"}`

### Check 2: Vercel Env Vars Set?
https://vercel.com/dashboard → Settings → Environment Variables
Must see `NEXT_PUBLIC_DJANGO_API` set

### Check 3: CORS Configured?
```bash
curl -I https://godlywomenn.onrender.com/api/auth/token/ \
  -H "Origin: https://godlywomenn.vercel.app"
```
Should see `access-control-allow-origin: https://godlywomenn.vercel.app`

### Check 4: Browser Console
Open DevTools → Console
Look for: `[API_URL] Using configured backend URL:`

If it says `localhost:8000`, env vars aren't set yet

## 📚 Full Details

See [LOGIN_REGISTRATION_FIX.md](./LOGIN_REGISTRATION_FIX.md) for complete technical details

