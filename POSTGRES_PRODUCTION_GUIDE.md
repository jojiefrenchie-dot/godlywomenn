# PostgreSQL on Render - Production Setup Guide

## Why PostgreSQL?

Your application was experiencing data loss because SQLite:
- Is not designed for persistent cloud storage
- Has issues with concurrent writes  
- Loses data when the container restarts
- Cannot scale for production use

PostgreSQL solves all of these issues.

## Quick Start

### Local Development Setup

1. **Install PostgreSQL**
   - See `POSTGRES_SETUP_GUIDE.txt` for detailed instructions

2. **Create `.env` file in `backend/` folder**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=godlywomen_db
   DB_USER=godly_user
   DB_PASSWORD=your_secure_password
   DJANGO_SECRET_KEY=your-secret-key
   DEBUG=True
   ```

3. **Run migrations**
   ```bash
   cd backend
   python manage.py migrate
   ```

4. **Test the backend**
   ```bash
   python manage.py runserver
   ```

### Production Setup on Render

#### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Fill in the form:
   - **Name**: `godlywomen-db`
   - **Database**: `godlywomen_db`
   - **User**: `godly_user`
   - **Region**: Same as your backend (e.g., Ohio)
   - **PostgreSQL Version**: Latest available
4. Click "Create Database"
5. Wait 2-3 minutes for provisioning
6. Copy the "External Database URL"

#### Step 2: Update Backend Service on Render

1. Go to your backend service: `godlywomenn`
2. Click "Settings" → "Environment"
3. Add/update environment variable:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```
   (Paste the External Database URL from Step 1)

4. Click "Save" - service will automatically redeploy

#### Step 3: Run Migrations on Production

1. In Render dashboard, click on your service
2. Go to "Shell" tab
3. Run the command:
   ```bash
   python manage.py migrate
   ```
   You should see migrations applying successfully

#### Step 4: Verify Data Persistence

1. Create some test data through the API
2. Trigger a redeploy or service restart
3. Verify the data is still there

That's it! Your data is now safely persisted in PostgreSQL.

## Troubleshooting

### "could not connect to server" error
- Check DATABASE_URL is correctly set
- Ensure PostgreSQL database exists on Render
- Wait a few minutes for Render to fully provision the database

### Migrations fail with permission errors
- Go to Render dashboard
- Click on your PostgreSQL database
- Check the user has permissions
- Try connecting with pgAdmin to verify

### Data still disappearing
- Verify DATABASE_URL is set (not using SQLite)
- Check service logs for database connection errors
- Ensure the external database URL is being used

### How to Access PostgreSQL from Command Line

Using `psql`:
```bash
psql "postgresql://user:password@host:port/database"
```

Using pgAdmin (web interface):
1. Go to https://pgadmin.com
2. Register for free account
3. Create connection using your Render database URL

## Comparison: SQLite vs PostgreSQL

| Feature | SQLite | PostgreSQL |
|---------|--------|-----------|
| Data Persistence | ❌ Lost on restart | ✅ Fully persistent |
| Concurrent Writes | ❌ Limited | ✅ Full ACID |
| Cloud Ready | ❌ Poor | ✅ Excellent |
| Scalability | ❌ Single file | ✅ Full server |
| Backups | ❌ Manual | ✅ Automatic |
| Production Ready | ❌ No | ✅ Yes |

## Monitoring PostgreSQL

On Render dashboard:
- Click your PostgreSQL database
- View CPU, memory, and storage metrics
- Check "Logs" for any issues
- Monitor connection count

## Backing Up Your Data

Render provides automatic daily backups. To create a manual backup:

1. Go to PostgreSQL database settings
2. Click "Backups"
3. Click "Create Backup"
4. Wait a few minutes

To restore from backup, contact Render support or use pgAdmin.

## Migrating Existing Data from SQLite

If you have existing data in SQLite that you want to migrate:

1. **Export from SQLite**
   ```bash
   python manage.py dumpdata > backup.json
   ```

2. **Clear and migrate PostgreSQL**
   ```bash
   python manage.py migrate
   ```

3. **Import into PostgreSQL**
   ```bash
   python manage.py loaddata backup.json
   ```

## Database Connection Pooling

PostgreSQL on Render may have connection limits. If you see "too many connections" errors:

1. The Django settings automatically handle connection pooling
2. `CONN_MAX_AGE=600` keeps connections alive for 10 minutes
3. Gunicorn automatically manages worker connections

You don't need to do anything - it's already configured!

## Next Steps

1. ✅ Set up PostgreSQL locally
2. ✅ Test and verify migrations work
3. ✅ Deploy to Render with DATABASE_URL
4. ✅ Verify data persists
5. ✅ Monitor in Render dashboard

Your application is now production-ready with persistent, scalable database!
