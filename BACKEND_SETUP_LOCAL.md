# Backend Local Development Setup

## Problem Analysis
Your backend was having data persistence issues because:

1. **Production Database Configuration**: The main `.env` file was pointing to Render's managed PostgreSQL service
2. **Session Cleanup**: Render PostgreSQL may have automated data retention policies or connection cleanup
3. **Missing Local Configuration**: No proper local development database was configured

## Solution

### 1. Environment Configuration (Fixed)

Your backend now has:
- **`.env`** → Production configuration (Render PostgreSQL)
- **`.env.local`** → Local development configuration (SQLite) - **This is what you should use locally**

### 2. How to Run Locally

#### Option A: SQLite (Recommended for Local Development)

```powershell
# Set environment to use .env.local
$env:ENV_FILE = ".env.local"

# Navigate to backend
cd backend

# Apply migrations (one-time)
.venv\Scripts\python.exe manage.py migrate

# Create superuser (one-time)
.venv\Scripts\python.exe manage.py createsuperuser

# Run server
.venv\Scripts\python.exe manage.py runserver 8000
```

#### Option B: PostgreSQL (Local)

If you have PostgreSQL running locally:

```powershell
# Update .env.local
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/godlywomen_db

# Then apply migrations
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py runserver 8000
```

### 3. Key Configuration Files

- **Backend Settings**: `backend/backend_project/settings.py`
  - Checks `DATABASE_URL` environment variable
  - If not set: Uses SQLite (`db.sqlite3`)
  - If set: Uses PostgreSQL

- **Local Override**: `backend/.env.local`
  - Do NOT set `DATABASE_URL`
  - Django will automatically use SQLite

### 4. Database File Location

SQLite database is stored at:
```
backend/db.sqlite3
```

This file is:
- ✅ Excluded from Git (in `.gitignore`)
- ✅ Persisted locally on your machine
- ✅ Only deleted if you manually delete it

### 5. Verify Data Persistence

```powershell
# Check if database exists and has data
.venv\Scripts\python.exe manage.py dbshell
```

In SQLite shell:
```sql
SELECT COUNT(*) FROM auth_user;  -- Check users
SELECT COUNT(*) FROM marketplace_listing;  -- Check marketplace items
```

### 6. Common Issues & Fixes

**Issue**: "django.db.utils.OperationalError: could not translate host name"
- **Fix**: Make sure `DATABASE_URL` is NOT set in `.env.local`

**Issue**: "Table does not exist"
- **Fix**: Run `python manage.py migrate`

**Issue**: Data disappears after restart
- **Fix**: Verify you're using `.env.local` (not `.env`)

### 7. Using the Task Runner

A VS Code task is available:

```
"Start Django Backend" task - runs on port 8000
```

This task automatically handles the environment setup.

## Next Steps

1. Delete old `db.sqlite3` (to start fresh)
2. Run migrations: `python manage.py migrate`
3. Create a test user: `python manage.py createsuperuser`
4. Start the backend
5. Test by creating users/listings - they should persist!

## Production Deployment

For production on Render:
- Use the main `.env` file
- PostgreSQL database is managed by Render
- Data persists in the managed database
