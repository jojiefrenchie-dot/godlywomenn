# Django Backend Deployment on Render

## Step 1: Update Backend Settings for Production

Your Django backend needs updates for Render production environment:

### 1.1 Update `backend/requirements.txt`

Add these packages to support production:
```
Django>=4.2
djangorestframework
djangorestframework-simplejwt
django-cors-headers
transformers
torch
detoxify
Pillow
dj-database-url==2.1.0
gunicorn
whitenoise
psycopg2-binary
python-decouple
```

### 1.2 Update `backend/backend_project/settings.py`

Replace `settings.py` with production-ready configuration:

```python
from pathlib import Path
import os
from datetime import timedelta
import dj_database_url
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-in-production')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'articles',
    'marketplace',
    'prayers',
    'messaging',
]

MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this for static files
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend_project.wsgi.application'

# Database - use PostgreSQL on Render
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media files (uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Rest Framework + JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
}

# CORS
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000'
).split(',')
CORS_ALLOW_CREDENTIALS = True

# Use custom user model
AUTH_USER_MODEL = 'users.User'

# Security Settings for Production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_SECURITY_POLICY = {
        "default-src": ("'self'",),
    }
```

## Step 2: Create Render Configuration File

Create `render.yaml` in the root of your project:

```yaml
services:
  - type: web
    name: godlywomen-backend
    env: python
    region: ohio
    plan: free
    buildCommand: pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
    startCommand: gunicorn backend_project.wsgi:application
    envVars:
      - key: DEBUG
        value: "False"
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_HOSTS
        value: "*.render.com"
      - key: CORS_ALLOWED_ORIGINS
        value: "https://godlywomen.vercel.app,https://yourfrontend.com"
      - key: DATABASE_URL
        fromDatabase:
          name: godlywomen_db
          property: connectionString
  
  - type: pserv
    name: godlywomen_db
    env: postgres
    region: ohio
    plan: free
    ipAllowList: []
```

## Step 3: Push Changes to GitHub

```bash
cd c:\Godlywomen
git add backend/requirements.txt backend/backend_project/settings.py render.yaml
git commit -m "Prepare Django backend for Render deployment"
git push origin main
```

## Step 4: Deploy on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `main` branch
5. Configure:
   - **Name**: godlywomen-backend
   - **Environment**: Python 3
   - **Region**: Ohio (or closest to you)
   - **Plan**: Free
   - **Build Command**: `pip install -r backend/requirements.txt && cd backend && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command**: `cd backend && gunicorn backend_project.wsgi:application`
6. Add environment variables in "Environment" section:
   ```
   DEBUG=False
   SECRET_KEY=<generate-a-secure-key>
   ALLOWED_HOSTS=yourservice.render.com
   DATABASE_URL=<Render will provide this if using PostgreSQL>
   CORS_ALLOWED_ORIGINS=https://yourfrontend.vercel.app
   ```
7. Click **"Create Web Service"**

## Step 5: Add PostgreSQL Database (Optional but Recommended)

1. In Render dashboard, go to **"Databases"**
2. Click **"New Database"**
3. Name it: `godlywomen-db`
4. Select PostgreSQL
5. Plan: Free
6. Copy the connection string and add to your service as `DATABASE_URL`

## Step 6: Configure Environment Variables

Go to your service settings and add:

| Variable | Value |
|----------|-------|
| `DEBUG` | `False` |
| `SECRET_KEY` | Generate a secure 50+ character key |
| `ALLOWED_HOSTS` | `yourservice.render.com` |
| `DATABASE_URL` | (Render provides if using PostgreSQL) |
| `CORS_ALLOWED_ORIGINS` | `https://godlywomen.vercel.app,https://yourfrontend.com` |

## Step 7: Manual Migrations (if needed)

If migrations don't run automatically, SSH into your service and run:
```bash
python manage.py migrate
python manage.py createsuperuser
```

## Testing

1. Visit `https://yourservice.render.com/api/` - should see DRF browsable API
2. Check logs: Dashboard → Your Service → "Logs" tab
3. Test API endpoints from your frontend
4. Update frontend `.env` to use the new backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://yourservice.render.com
   ```

## Troubleshooting

- **502 Bad Gateway**: Check logs, usually due to missing environment variables or migration errors
- **Static files not loading**: Run collectstatic manually via SSH
- **Database connection errors**: Verify DATABASE_URL is set correctly
- **CORS errors**: Update CORS_ALLOWED_ORIGINS with your frontend URL

## Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- Shared resources (may be slow)
- Limited to 0.5 GB RAM
- Limited bandwidth

For production, upgrade to paid tier.
