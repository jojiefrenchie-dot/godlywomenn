# Production Deployment Commands

## 1. Generate Secret Keys

### Generate NEXTAUTH_SECRET (32+ random characters)
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Online (if no CLI available)
# Visit: https://generate-secret.now.sh/
```

### Generate DJANGO_SECRET_KEY
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

## 2. Database Setup (Production)

### PostgreSQL Connection String Format
```
postgresql://username:password@host:port/database_name
```

### Create .env.production with Database URL
```bash
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/godlywomen"
```

## 3. Run Migrations

### Using Django management command
```bash
cd backend
python manage.py migrate --settings=backend_project.settings_production
```

### Using Docker
```bash
docker-compose run backend python manage.py migrate --settings=backend_project.settings_production
```

## 4. Collect Static Files

### Using Django management command
```bash
cd backend
python manage.py collectstatic --noinput --settings=backend_project.settings_production
```

### Using Docker
```bash
docker-compose run backend python manage.py collectstatic --noinput --settings=backend_project.settings_production
```

## 5. Build Next.js Production Bundle

### Local build
```bash
npm run build
```

### Docker build
```bash
docker-compose build frontend
```

## 6. Deploy Options

### Option A: Using Railway (Easiest - Recommended)

#### Prerequisites
- Railway account (free tier available): https://railway.app
- GitHub account with repo access

#### Steps
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login to Railway
railway login

# 3. Link to project
railway link

# 4. Set production environment variables
railway variables set NEXTAUTH_SECRET=your_secret
railway variables set DJANGO_SECRET_KEY=your_key
railway variables set DATABASE_URL=postgresql://...
railway variables set NEXTAUTH_URL=https://your-domain.com
railway variables set NEXT_PUBLIC_APP_URL=https://your-domain.com
railway variables set NEXT_PUBLIC_DJANGO_API=https://your-domain.com/api

# 5. Deploy
railway up
```

### Option B: Using Docker Compose (VPS/Local)

#### Prerequisites
- Server with Docker and Docker Compose installed
- Domain name pointing to server IP
- SSL certificate (Let's Encrypt recommended)

#### Steps
```bash
# 1. Create .env.production with all variables
cp .env.production.example .env.production
# Edit .env.production with actual values

# 2. Build and start services
docker-compose up -d

# 3. Run migrations
docker-compose exec backend python manage.py migrate --settings=backend_project.settings_production

# 4. Collect static files
docker-compose exec backend python manage.py collectstatic --noinput --settings=backend_project.settings_production

# 5. Create superuser (optional)
docker-compose exec backend python manage.py createsuperuser --settings=backend_project.settings_production
```

### Option C: Manual Deployment (Advanced)

#### Prerequisites
- Server running Node.js 18+ and Python 3.9+
- PostgreSQL database
- Nginx or Apache reverse proxy
- SSL certificate

#### Steps
```bash
# 1. Clone repository
git clone https://github.com/yourusername/godlywomen.git
cd godlywomen

# 2. Create .env.production
nano .env.production
# Add all production variables

# 3. Install dependencies
pip install -r backend/requirements_production.txt
npm ci

# 4. Build frontend
npm run build

# 5. Run migrations
cd backend
python manage.py migrate --settings=backend_project.settings_production
python manage.py collectstatic --noinput --settings=backend_project.settings_production
cd ..

# 6. Start backend (using gunicorn)
cd backend
gunicorn --workers 4 --bind 127.0.0.1:8000 backend_project.wsgi --settings=backend_project.settings_production

# 7. Start frontend (in separate terminal)
npm start

# 8. Configure Nginx/reverse proxy to forward:
#    - /api/* -> backend:8000
#    - /* -> frontend:3000
```

## 7. Verify Deployment

### Check health endpoint
```bash
curl https://your-domain.com/health/
# Should return: {"status": "ok"}
```

### Check API connectivity
```bash
curl https://your-domain.com/api/test-connection/
# Should return: {"status": "Connected successfully", ...}
```

### Check articles endpoint
```bash
curl https://your-domain.com/api/articles/
# Should return array of articles
```

### Check frontend
```bash
# Visit https://your-domain.com in browser
# Should load without console errors
```

## 8. Troubleshooting

### 502 Bad Gateway
- Check if backend is running: `docker-compose ps` or `ps aux | grep gunicorn`
- Check backend logs: `docker-compose logs backend`
- Verify DATABASE_URL connection: `psql $DATABASE_URL`

### Static files not loading
- Check STATIC_URL in settings_production.py
- Verify `collectstatic` was run successfully
- Check web server serving /static/ directory

### Database connection errors
- Verify DATABASE_URL format: `postgresql://user:password@host:port/db`
- Test connection: `psql postgresql://user:password@host:port/db`
- Check credentials in .env.production

### NEXTAUTH errors
- Verify NEXTAUTH_SECRET is set and 32+ characters
- Verify NEXTAUTH_URL matches your domain
- Check browser cookies are not blocked

### API returns CORS errors
- Verify CORS_ALLOWED_ORIGINS includes your frontend domain
- Check that requests include proper Authorization headers
- Verify CSRF exemption for API endpoints

## 9. Monitoring Commands

### Check service status (Docker)
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Monitor database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d godlywomen

# List tables
\dt

# Check connections
SELECT * FROM pg_stat_activity;
```

### Restart service
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 10. Emergency Commands

### Stop all services
```bash
docker-compose down
```

### Backup database
```bash
docker-compose exec postgres pg_dump -U postgres godlywomen > backup_$(date +%Y%m%d).sql
```

### Restore database
```bash
docker-compose exec -T postgres psql -U postgres < backup_20250101.sql
```

### View disk usage
```bash
docker system df
```

### Clean unused Docker resources
```bash
docker system prune -a
```
