# Production Deployment Quick Start

## TL;DR - Deploy in 3 Steps

### Backend to Railway

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to railway.app and connect GitHub repo
# 3. Set these environment variables in Railway:
DJANGO_SECRET_KEY=<run: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com,yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.vercel.app

# Railway automatically provides: DATABASE_URL
# Railway automatically deploys!
```

### Frontend to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com and import project
# 3. Set these environment variables in Vercel:
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_DJANGO_API=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Vercel automatically deploys on git push!
```

---

## Critical Environment Variables

### Generate Django Secret Key
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### Or use online generators
- Django Secret: https://djecrety.ir/
- NextAuth Secret: https://generate-secret.vercel.app/32

---

## Verify Deployment

### Backend Health Check
```bash
curl https://api.yourdomain.com/
```

### Frontend Health Check  
```bash
curl https://yourdomain.vercel.app/
```

### Test Authentication
1. Visit https://yourdomain.vercel.app
2. Click "Create Account"
3. Fill in form and submit
4. Login with those credentials
5. You should see dashboard

---

## Common Issues & Fixes

### "Authentication credentials were not provided"
→ Check `CORS_ALLOWED_ORIGINS` includes your frontend domain

### "Could not connect to Django"
→ Check `NEXT_PUBLIC_DJANGO_API` is correct and backend is running

### "Invalid SECRET_KEY"
→ Ensure `DJANGO_SECRET_KEY` matches what you set in environment

### "Database connection failed"
→ Railway auto-creates DATABASE_URL, it should be set automatically

### "502 Bad Gateway"
→ Check backend logs in Railway dashboard
→ Run migrations: `python manage.py migrate`
→ Restart application

---

## Files You Need to Know

### Create/Update These

| File | Purpose |
|------|---------|
| `.env.production.local` | ❌ NEVER commit this! |
| Railway Dashboard | Set all Django env vars here |
| Vercel Dashboard | Set all Next.js env vars here |

### Reference These

| File | What It Does |
|------|--------------|
| `PRODUCTION_DEPLOYMENT_GUIDE.md` | Step-by-step instructions |
| `PRODUCTION_READINESS_CHECKLIST.md` | Pre-deployment checklist |
| `PRODUCTION_ISSUES_AND_FIXES.md` | Detailed issue analysis |
| `PRODUCTION_READINESS_REPORT.md` | Full status report |

---

## Before Clicking Deploy

- [ ] `DJANGO_SECRET_KEY` is set and secure
- [ ] `NEXTAUTH_SECRET` is set and secure
- [ ] `CORS_ALLOWED_ORIGINS` includes your frontend domain
- [ ] Domain name registered and DNS configured
- [ ] Read through PRODUCTION_DEPLOYMENT_GUIDE.md

---

## After Deployment

1. **Test immediately**
   ```bash
   curl https://yourdomain.vercel.app
   curl https://api.yourdomain.com
   ```

2. **Test auth flow**
   - Register new account
   - Sign in
   - Sign out
   - Test password reset

3. **Check logs**
   - Railway: Dashboard → Logs
   - Vercel: Deployments → Logs

4. **Monitor for 24 hours**
   - Watch for errors
   - Check response times
   - Verify data is persisting

---

## Troubleshooting Commands

```bash
# Check Django logs (if SSH'd into Railway)
tail -f logs.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Check database
python manage.py dbshell
```

---

## Support Resources

- 📖 [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- 📋 [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md)
- 🔍 [PRODUCTION_ISSUES_AND_FIXES.md](./PRODUCTION_ISSUES_AND_FIXES.md)
- 📊 [PRODUCTION_READINESS_REPORT.md](./PRODUCTION_READINESS_REPORT.md)

---

## Status: ✅ READY TO DEPLOY

Your app is production-ready. Follow the quick start above or see detailed guides for step-by-step instructions.

**Estimated deployment time**: 30 minutes from start to fully operational
