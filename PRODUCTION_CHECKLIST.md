# Production Readiness Checklist

## Security Configuration
- [ ] NEXTAUTH_SECRET set (32+ characters) - `openssl rand -base64 32`
- [ ] DJANGO_SECRET_KEY set securely
- [ ] DEBUG = False in production settings
- [ ] SECURE_SSL_REDIRECT = True
- [ ] SECURE_HSTS_SECONDS = 31536000
- [ ] ALLOWED_HOSTS configured for your domain(s)
- [ ] CORS_ALLOWED_ORIGINS set to production domain only
- [ ] SESSION_COOKIE_SECURE = True
- [ ] CSRF_COOKIE_SECURE = True
- [ ] SESSION_COOKIE_HTTPONLY = True
- [ ] CSRF_COOKIE_HTTPONLY = True

## Environment Variables
- [ ] .env.production created with all required variables
- [ ] .env.production NOT committed to git
- [ ] NEXT_PUBLIC_APP_URL set to production domain
- [ ] NEXT_PUBLIC_DJANGO_API set to production API URL
- [ ] NEXTAUTH_URL set correctly
- [ ] DATABASE_URL configured for PostgreSQL
- [ ] Email configuration set (SMTP server, credentials)

## Database
- [ ] PostgreSQL database created and accessible
- [ ] Migrations run: `python manage.py migrate --settings=backend_project.settings_production`
- [ ] Superuser created for Django admin
- [ ] Database backup procedure documented
- [ ] Regular backup schedule configured

## Frontend (Next.js)
- [ ] Production build verified: `npm run build`
- [ ] No build errors or warnings
- [ ] All environment variables set
- [ ] CSS and JavaScript assets minified
- [ ] Images optimized
- [ ] Fonts loaded from CDN or local (no FOUT)

## Backend (Django)
- [ ] Static files collected: `python manage.py collectstatic --noinput --settings=backend_project.settings_production`
- [ ] Media directory writable and backed up
- [ ] ALLOWED_HOSTS includes production domain
- [ ] CORS headers properly configured
- [ ] Database connection pooling configured (if needed)
- [ ] Logging configured for production

## API Endpoints
- [ ] Health check endpoint working: `/health/`
- [ ] Articles endpoint returns data: `/api/articles/`
- [ ] Auth endpoints secure: `/api/auth/`
- [ ] Rate limiting configured
- [ ] API documentation available

## SSL/TLS
- [ ] SSL certificate installed
- [ ] Certificate not self-signed
- [ ] Certificate covers all domains
- [ ] HTTPS redirect configured
- [ ] HSTS header enabled
- [ ] Certificate auto-renewal configured

## Performance
- [ ] Static files serve with caching headers
- [ ] Database queries optimized
- [ ] No N+1 queries in common operations
- [ ] Frontend assets cached with version hashes
- [ ] CDN configured (if applicable)
- [ ] Database indexes created

## Monitoring & Logging
- [ ] Error tracking service configured (Sentry/similar)
- [ ] Application logs configured and accessible
- [ ] Database logs monitored
- [ ] Uptime monitoring configured
- [ ] Alert system for critical errors
- [ ] Daily/weekly log review scheduled

## Backups
- [ ] Database backup automated
- [ ] Media files backup automated
- [ ] Backup retention policy set
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## Deployment Process
- [ ] Deployment automation configured
- [ ] Pre-deployment checks automated
- [ ] Database migrations automated
- [ ] Static file collection automated
- [ ] Rollback procedure documented
- [ ] Deployment notifications enabled

## Docker (if applicable)
- [ ] Docker image builds successfully
- [ ] docker-compose.yml uses production settings
- [ ] All services start without errors
- [ ] Networks and volumes configured correctly
- [ ] Registry credentials secured

## Testing
- [ ] All critical features tested on production-like environment
- [ ] Mobile responsiveness verified
- [ ] API endpoints return expected responses
- [ ] Authentication flow tested end-to-end
- [ ] File uploads working
- [ ] Search functionality working
- [ ] Pagination working

## Documentation
- [ ] Deployment guide written and accessible
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide created
- [ ] Emergency contact list created

## Post-Deployment
- [ ] Website accessible and loads quickly
- [ ] All features functional
- [ ] No console errors in browser
- [ ] API responds correctly
- [ ] Database queries performing well
- [ ] Error tracking working
- [ ] Monitoring alerts configured
- [ ] Team notified of deployment

## First 24 Hours
- [ ] Monitor error logs frequently
- [ ] Check database performance
- [ ] Verify backups are running
- [ ] Confirm monitoring alerts working
- [ ] User feedback monitored
- [ ] Performance metrics reviewed
