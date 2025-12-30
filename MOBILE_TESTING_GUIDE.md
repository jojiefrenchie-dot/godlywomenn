# Mobile Testing Guide

## Problem: "Load Failed" on Mobile

When testing on mobile devices or emulators, URLs using `localhost` or `127.0.0.1` **won't work** because these are loopback addresses that only exist on the local machine.

## Solution: Use Your Machine's IP Address

### Step 1: Find Your Machine's IP Address

**Windows (PowerShell)**:
```powershell
ipconfig
```
Look for "IPv4 Address" under your network adapter (usually 192.168.x.x or 10.x.x.x)

**Mac/Linux**:
```bash
ifconfig
```
Look for `inet` address under your active network connection

### Step 2: Update .env.local

Replace `localhost` with your actual IP address:

**Before** (development/localhost only):
```
NEXT_PUBLIC_DJANGO_API=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
```

**After** (works on mobile):
```
NEXT_PUBLIC_DJANGO_API=http://192.168.1.100:8000
NEXTAUTH_URL=http://192.168.1.100:3000
NEXT_PUBLIC_APP_URL=http://192.168.1.100:3000
```

Replace `192.168.1.100` with YOUR actual IP address from Step 1.

### Step 3: Ensure Backend is Accessible

Your Django backend must be listening on `0.0.0.0` to accept connections from other machines:

```bash
# Default - only localhost
python manage.py runserver

# ALL interfaces (required for mobile)
python manage.py runserver 0.0.0.0:8000
```

### Step 4: Test Mobile Connection

#### Option A: Android Emulator
- Emulator can access host machine via `10.0.2.2`
- Update .env.local:
```
NEXT_PUBLIC_DJANGO_API=http://10.0.2.2:8000
NEXT_PUBLIC_APP_URL=http://10.0.2.2:3000
```

#### Option B: Physical Mobile Device on Same WiFi
- Both phone and dev machine must be on same WiFi
- Use your machine's actual IP (from Step 1)
- Test connection: Open `http://192.168.1.100:8000/api/` in mobile browser
  - Should see Django REST API interface or JSON response
  - If error: Check Django is running with `0.0.0.0:8000`

#### Option C: iOS Simulator
- Simulator can access host machine via `127.0.0.1` (just like desktop)
- Use localhost settings normally

## Quick Mobile Testing Checklist

- [ ] Found machine IP address (`ipconfig` or `ifconfig`)
- [ ] Updated NEXT_PUBLIC_DJANGO_API with IP in .env.local
- [ ] Updated NEXTAUTH_URL with IP in .env.local
- [ ] Started Django: `python manage.py runserver 0.0.0.0:8000`
- [ ] Started Next.js: `npm run dev`
- [ ] Tested direct API access: `http://YOUR_IP:8000/api/` in mobile browser
- [ ] Tested app: Opened `http://YOUR_IP:3000` in mobile browser
- [ ] Verified images load (check next.config.ts allows your IP)
- [ ] Tested login/registration

## Common Issues

### "ERR_NAME_NOT_RESOLVED" or "Network Error"
- Ensure Django is running on `0.0.0.0` not just `localhost`
- Ensure firewall allows port 8000 and 3000
- Verify .env.local has correct IP address

### "ERR_CONNECTION_REFUSED"
- Next.js or Django not running
- Wrong IP address in .env.local
- Backend listening on localhost instead of 0.0.0.0

### Images Not Loading
- Check next.config.ts remotePatterns (already fixed for all HTTPS)
- For HTTP: Verify port 8000 is included in remotePatterns
- Test image URL directly: `http://YOUR_IP:8000/media/path/to/image.jpg`

### CORS Errors
- Backend must have correct CORS origins
- Django CORS_ALLOWED_ORIGINS must include your IP
- Check `backend_project/settings.py` for CORS configuration

### Authentication Failing
- NextAuth session might be tied to localhost
- Clear browser storage and cache
- Verify NEXTAUTH_SECRET is same in both dev and mobile testing

## For Production Mobile Testing

When deploying to production (Railway, Heroku, etc.):
- Set NEXT_PUBLIC_DJANGO_API to your backend URL
- Set NEXT_PUBLIC_APP_URL to your frontend URL
- Mobile devices will use these production URLs automatically
- No need to change environment variables for each device

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_APP_URL` | Next.js URL for internal redirects | `http://192.168.1.100:3000` |
| `NEXT_PUBLIC_DJANGO_API` | Django backend API | `http://192.168.1.100:8000` |
| `NEXTAUTH_URL` | NextAuth callback URL | `http://192.168.1.100:3000` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | (32+ random chars) |

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and mobile apps.
