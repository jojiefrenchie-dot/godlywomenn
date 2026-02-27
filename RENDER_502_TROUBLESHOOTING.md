# Render 502 Bad Gateway - Troubleshooting Steps

## IMMEDIATE ACTIONS (Do these first)

### 1. Check Render Logs
1. Go to https://dashboard.render.com
2. Click on `godlywomen-backend` service
3. Click the **"Logs"** tab
4. Look for error messages - note the exact error

### 2. Verify Environment Variables in Render
Go to your service → **Environment** and confirm these are set:

```
DEBUG=False
SECRET_KEY=<long-random-string>
ALLOWED_HOSTS=godlywomenn.onrender.com,localhost
DATABASE_URL=postgresql://user:pass@host:port/dbname  (if using PostgreSQL)
CORS_ALLOWED_ORIGINS=https://godlywomen.vercel.app
```

**CRITICAL**: The environment must have `SECRET_KEY` or `DJANGO_SECRET_KEY` set!

### 3. Check Your Code Changes
After my updates, your `settings.py` now expects these from environment. Make sure it's properly updated:

```python
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-in-production')
DEBUG = config('DEBUG', default=False, cast=bool)
```

## IF ABOVE DOESN'T WORK - Try these fixes:

### Fix 1: Use Simpler Start Command
Go to your service settings and change **Start Command** to:
```
cd backend && python manage.py runserver 0.0.0.0:8000
```
(This is slower but helps debug issues)

### Fix 2: Add PYTHONUNBUFFERED to Render
In Environment variables, add:
```
PYTHONUNBUFFERED=1
```

### Fix 3: Generate New SECRET_KEY
1. Locally, run:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
2. Copy the output
3. Paste it as `SECRET_KEY` in Render Environment variables
4. Redeploy

### Fix 4: Check Database Connection (if using PostgreSQL)
1. Verify the PostgreSQL database exists in Render
2. Verify DATABASE_URL is correct format:
```
postgresql://username:password@host:port/database_name
```
3. Test locally with that connection string

### Fix 5: Update Build Command in Render
Go to your service → **Settings** → **Build Command** and set to:
```
cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### Fix 6: Manual SSH Debug (Advanced)
1. Click on your service
2. Click **"Shell"** tab
3. Run these commands:
```bash
cd backend
python manage.py check
echo "SECRET_KEY=$SECRET_KEY" | head -c 50
python manage.py migrate --verbosity 2
```

## Common 502 Causes:

| Error | Solution |
|-------|----------|
| `SECRET_KEY not set` | Add SECRET_KEY to Environment variables |
| `ModuleNotFoundError: No module named 'dj_database_url'` | Already in requirements.txt, re-run build |
| `ALLOWED_HOSTS` issues | Set to `*.render.com` or specific domain |
| `No database migrations` | Ensure build command includes `migrate` |
| `Import errors in settings.py` | Check for syntax errors in settings.py |
| `Port not available` | Gunicorn should bind to 0.0.0.0:8000 by default |

## Testing Your Backend

Once it's working:
```bash
# Test the API root
curl https://godlywomenn.onrender.com/api/

# Should return DRF browsable API or API response
```

## If STILL Not Working:

1. **Check if Django version conflicts** - ensure Django 4.2+ is in requirements.txt
2. **Verify no .pyc files are cached** - Render should handle this but worth checking
3. **Check if WSGI application is correct** - should be `backend_project.wsgi:application`
4. **Ensure manage.py exists** - should be at `/backend/manage.py`

## Rollback Plan

If nothing works, you can:
1. Create a new simple Django app on Render
2. Test it works
3. Then gradually add your code

OR revert to Railway/Heroku deployment instead.

## Need More Help?

Share these from Render logs:
- The actual error message shown in logs
- The last few lines before the 502 error
- Value of `DJANGO_SETTINGS_MODULE` if shown
