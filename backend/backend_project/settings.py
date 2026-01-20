from pathlib import Path
import os
from datetime import timedelta
import dj_database_url
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-in-production')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS', 
    default='localhost,127.0.0.1,godlywomenn.onrender.com,*.onrender.com,godlywomenn.vercel.app,*.vercel.app,testserver'
).split(',')

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
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'middleware.ErrorLoggingMiddleware',
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

# Database - use PostgreSQL on production, SQLite locally (with option to use PostgreSQL)
# PostgreSQL connection string examples:
# postgresql://user:password@host:port/dbname
# postgres://user:password@host:port/dbname
DB_URL = os.environ.get('DATABASE_URL')

if DB_URL:
    # Production: Use DATABASE_URL environment variable
    DATABASES = {
        'default': dj_database_url.config(
            default=DB_URL,
            conn_max_age=600,
            conn_health_checks=True,  # Enable connection health checks for PostgreSQL
        )
    }
    # Set isolation level in OPTIONS if using PostgreSQL
    if 'OPTIONS' not in DATABASES['default']:
        DATABASES['default']['OPTIONS'] = {}
    DATABASES['default']['OPTIONS']['isolation_level'] = 1  # Read Committed isolation level
    
    db_engine = DATABASES['default']['ENGINE']
    print(f"[DB] Using {db_engine.split('.')[-1]} database from DATABASE_URL")
else:
    # Local development: Try PostgreSQL first, fall back to SQLite
    PG_HOST = os.environ.get('DB_HOST', 'localhost')
    PG_PORT = os.environ.get('DB_PORT', '5432')
    PG_NAME = os.environ.get('DB_NAME', 'godlywomen_db')
    PG_USER = os.environ.get('DB_USER', 'postgres')
    PG_PASSWORD = os.environ.get('DB_PASSWORD', '')
    
    # Try to use PostgreSQL
    try:
        import psycopg2
        if PG_PASSWORD:
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.postgresql',
                    'NAME': PG_NAME,
                    'USER': PG_USER,
                    'PASSWORD': PG_PASSWORD,
                    'HOST': PG_HOST,
                    'PORT': PG_PORT,
                    'CONN_MAX_AGE': 600,
                    'OPTIONS': {
                        'connect_timeout': 10,
                        'options': '-c default_transaction_isolation=read_committed',
                    },
                }
            }
            print(f"[DB] Using PostgreSQL at {PG_HOST}:{PG_PORT}/{PG_NAME}")
        else:
            raise ValueError("DB_PASSWORD not set for PostgreSQL")
    except (ImportError, ValueError) as e:
        # Fall back to SQLite
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
        db_path = DATABASES['default']['NAME']
        if db_path and db_path != ':memory:':
            db_dir = os.path.dirname(db_path)
            if db_dir:
                os.makedirs(db_dir, exist_ok=True)
        print(f"[DB] Using SQLite at: {db_path} (reason: {str(e)})")

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR.parent / 'public',
    BASE_DIR.parent / '.next' / 'static',
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
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,  # Disabled - requires rest_framework_simplejwt.token_blacklist app
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

# CORS - Allow both production and preview Vercel domains
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000,https://godlywomenn.vercel.app,https://godlywomenn-jwsu32jqp-jojiefrenchie-dots-projects.vercel.app'
).split(',')
CORS_ALLOW_CREDENTIALS = True

# Session Configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 86400 * 7  # 7 days
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# For local development, allow non-secure cookies over HTTP
if DEBUG:
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SECURE = False
else:
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    CSRF_COOKIE_SECURE = True

# Use custom user model
AUTH_USER_MODEL = 'users.User'

# Security Settings for Production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_SECURITY_POLICY = {
        "default-src": ("'self'",),
    }

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '[{levelname}] {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'backend.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
        '': {  # root logger
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
