#!/bin/bash
# Production setup script for Django backend
# Usage: bash setup_production.sh

set -e

echo "======================================"
echo "Godlywomen Production Setup Script"
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install production dependencies
echo ""
echo "Installing production dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements_production.txt

# Generate Django secret key
echo ""
echo "Generating Django SECRET_KEY..."
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
echo "SECRET_KEY=$SECRET_KEY"

# Generate NextAuth secret
echo ""
echo "Generating NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"

# Create .env.production.local template
echo ""
echo "Creating .env.production.local template..."
cat > .env.production.local.template << EOF
# Django Backend Configuration
DJANGO_SECRET_KEY=$SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/godlywomen
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://yourdomain.vercel.app

# Next.js Frontend Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_DJANGO_API=https://api.yourdomain.com
EOF

echo "✅ Template created: .env.production.local.template"
echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Review .env.production.local.template"
echo "2. Update values for your domain"
echo "3. Copy to .env.production.local (never commit this!)"
echo "4. Run: python manage.py migrate"
echo "5. Run: python manage.py createsuperuser"
echo ""
echo "For Railway deployment:"
echo "  - Set environment variables in Railway dashboard"
echo "  - Push to GitHub and Railway will auto-deploy"
echo ""
echo "For Vercel deployment:"
echo "  - Set environment variables in Vercel dashboard"
echo "  - Push to GitHub and Vercel will auto-deploy"
echo ""
