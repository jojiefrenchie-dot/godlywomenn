#!/bin/bash
# Troubleshooting script for Render deployment

echo "=== Checking Environment Variables ==="
echo "DEBUG: $DEBUG"
echo "SECRET_KEY set: $([ -z "$SECRET_KEY" ] && echo 'NO (CRITICAL)' || echo 'YES')"
echo "ALLOWED_HOSTS: $ALLOWED_HOSTS"
echo "DATABASE_URL set: $([ -z "$DATABASE_URL" ] && echo 'NO' || echo 'YES')"
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"

echo ""
echo "=== Python & Package Check ==="
python --version
pip list | grep -E "Django|gunicorn|whitenoise|psycopg2"

echo ""
echo "=== Testing Django Setup ==="
cd backend
python manage.py check

echo ""
echo "=== Attempting to start Gunicorn ==="
gunicorn backend_project.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120
