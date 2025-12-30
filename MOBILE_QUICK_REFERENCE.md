# Mobile Testing Quick Reference

## The Problem
Mobile devices can't access `localhost`. It only exists on your dev machine.

## The Solution
Use your actual IP address instead of localhost.

## Quick Setup (< 2 minutes)

### 1. Get Your IP
```powershell
# Windows PowerShell
ipconfig
# Look for "IPv4 Address" like 192.168.1.100
```

### 2. Update .env.local
```
NEXT_PUBLIC_DJANGO_API=http://192.168.1.100:8000
NEXTAUTH_URL=http://192.168.1.100:3000
```
(Replace 192.168.1.100 with YOUR IP from step 1)

### 3. Start Backend (ALL interfaces)
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```
⚠️ IMPORTANT: Must be `0.0.0.0:8000` not `localhost:8000`

### 4. Start Frontend
```bash
npm run dev
```

### 5. Test on Mobile
Visit: `http://192.168.1.100:3000` (use YOUR IP)

---

## Automated Setup (Recommended)
```bash
# Windows
setup_mobile_testing.bat

# Mac/Linux
./setup_mobile_testing.sh
```
This automatically detects your IP and updates .env.local

---

## Common Issues & Fixes

| Error | Fix |
|-------|-----|
| "ERR_NAME_NOT_RESOLVED" | Use correct IP; run Django on 0.0.0.0:8000 |
| "ERR_CONNECTION_REFUSED" | Start Django and Next.js; check firewall |
| Images won't load | Check image URL in dev tools; verify next.config.ts |
| Can't login | Clear cache; verify NEXTAUTH_SECRET |

---

## Android Emulator Special Case
The emulator uses `10.0.2.2` instead of your IP:
```
NEXT_PUBLIC_DJANGO_API=http://10.0.2.2:8000
```

---

## Environment Variables Needed
| Variable | Example |
|----------|---------|
| NEXT_PUBLIC_DJANGO_API | http://192.168.1.100:8000 |
| NEXT_PUBLIC_APP_URL | http://192.168.1.100:3000 |
| NEXTAUTH_URL | http://192.168.1.100:3000 |
| NEXTAUTH_SECRET | (32+ random chars) |

---

## What's Been Fixed
✅ Image loading - next.config.ts now allows all HTTPS + port 8000 HTTP
✅ Viewport - Mobile rendering optimized
✅ Documentation - Complete guides and scripts created
✅ Configuration - Environment variable system explained

---

For detailed troubleshooting, see: MOBILE_TESTING_GUIDE.md
