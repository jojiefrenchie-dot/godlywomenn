# Quick Start: Deploy to Railway

Railway is the easiest and fastest way to deploy this app to production. It handles SSL, domains, and scaling automatically.

## Why Railway?
✅ Free tier available  
✅ Automatic HTTPS/SSL  
✅ GitHub integration (auto-redeploy on push)  
✅ Built-in PostgreSQL  
✅ Environment variables dashboard  
✅ One-click rollback  
✅ 24/7 uptime monitoring  

## Prerequisites
- Railway account: https://railway.app (free signup)
- GitHub account with this repo access
- 5 minutes

## Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "Start a New Project"
3. Click "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select `godlywomen` repository
6. Railway will create a new project

## Step 2: Add PostgreSQL Database

1. In Railway dashboard, click "+ New"
2. Select "PostgreSQL"
3. Wait for database to provision (~30 seconds)
4. Copy the DATABASE_URL from the database plugin

## Step 3: Configure Environment Variables

In Railway dashboard, go to Variables tab and add:

```
NEXTAUTH_SECRET = [run: openssl rand -base64 32]
DJANGO_SECRET_KEY = [run: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())']
DEBUG = False
ALLOWED_HOSTS = your-domain.railway.app,www.your-domain.com
CORS_ALLOWED_ORIGINS = https://your-domain.railway.app,https://www.your-domain.com
DATABASE_URL = [Already set by PostgreSQL plugin]
NEXTAUTH_URL = https://your-domain.railway.app
NEXT_PUBLIC_APP_URL = https://your-domain.railway.app
NEXT_PUBLIC_DJANGO_API = https://your-domain.railway.app/api
```

## Step 4: Configure Services

### Backend Service

1. Click the repository name → "New Service" → "GitHub Repo"
2. Select the same repo
3. Select root directory (with manage.py in backend/)
4. Environment: 
   - Root directory: `/backend`
   - Python version: 3.11
5. Build command: `pip install -r requirements_production.txt`
6. Start command: `gunicorn backend_project.wsgi --bind 0.0.0.0:8000`
7. Port: 8000

### Frontend Service

1. Click "+ New Service"
2. Select GitHub repo
3. Select root directory (with next.config.ts)
4. Environment:
   - Build: `npm run build`
   - Start: `npm start`
   - Node version: 18
5. Port: 3000

## Step 5: Run Database Migrations

1. Go to Deployments tab
2. Click the latest backend deployment
3. Click "View Logs" and find shell access
4. Run: `python manage.py migrate --settings=backend_project.settings_production`
5. Optionally create superuser: `python manage.py createsuperuser --settings=backend_project.settings_production`

## Step 6: Verify Deployment

1. Get your Railway domain from the project settings
2. Visit `https://your-domain.railway.app/health/`
3. Should see: `{"status": "ok"}`
4. Visit `https://your-domain.railway.app/api/test-connection/`
5. Should see connection status

## Step 7: Connect Custom Domain (Optional)

1. In Railway project settings
2. Go to "Domains"
3. Click "Add Domain"
4. Enter your domain: `godlywomen.com`
5. Configure DNS records (Railway will show instructions)
6. Wait for SSL certificate (~5 minutes)

## Common Issues

### Build fails - Python dependencies
**Error**: `ModuleNotFoundError` during build
**Solution**: Verify `backend/requirements_production.txt` exists and is complete

### Database migration error
**Error**: `relation "auth_user" does not exist`
**Solution**: Run migrations: `python manage.py migrate --settings=backend_project.settings_production`

### Frontend can't connect to API
**Error**: CORS error in browser console
**Solution**: 
1. Verify CORS_ALLOWED_ORIGINS includes frontend domain
2. Verify NEXT_PUBLIC_DJANGO_API set correctly

### Missing environment variable
**Error**: `KeyError: 'NEXTAUTH_SECRET'`
**Solution**: Add the variable in Railway dashboard Variables tab

### Static files returning 404
**Error**: CSS/images not loading
**Solution**: Ensure collectstatic was run: `python manage.py collectstatic --noinput --settings=backend_project.settings_production`

## Monitoring & Updates

### View logs
Click "View Logs" on any service to see real-time output

### Re-deploy
Push to GitHub and Railway automatically re-deploys (unless builds fail)

### Scale services
Click service → "Config" to adjust RAM/CPU

### Rollback
Click "Deployments" and select a previous deployment to rollback

## Troubleshooting Production

If the app doesn't work:

1. Check backend logs:
   - Railway dashboard → backend service → View Logs
   - Look for errors starting with "ERROR"

2. Check frontend logs:
   - Railway dashboard → frontend service → View Logs
   - Check browser console (F12) for errors

3. Test API directly:
   - Visit `https://domain.railway.app/health/`
   - Should return `{"status": "ok"}`

4. Check database:
   - Railway dashboard → PostgreSQL → Connect
   - Verify tables exist: `\dt`

5. Check environment variables:
   - Railway dashboard → Variables
   - Verify all required vars are set
   - Check spelling exactly

## Security Checklist Before Going Live

- [ ] DEBUG = False (not True)
- [ ] ALLOWED_HOSTS configured
- [ ] NEXTAUTH_SECRET is 32+ characters
- [ ] DJANGO_SECRET_KEY is strong and random
- [ ] SSL certificate installed (Railway does this automatically)
- [ ] Database backups enabled
- [ ] Error tracking configured (Sentry recommended)
- [ ] Monitor uptime (Railway provides free monitoring)

## Next Steps

- Set up custom domain
- Enable error tracking (Sentry, Rollbar)
- Configure email for password resets
- Set up monitoring and alerts
- Plan backup strategy
- Configure CDN for static assets

## Support

- Railway docs: https://docs.railway.app
- Django deployment: https://docs.djangoproject.com/en/4.2/howto/deployment/
- Next.js production: https://nextjs.org/docs/deployment
