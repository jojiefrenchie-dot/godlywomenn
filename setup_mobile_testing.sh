#!/bin/bash

# Mobile Testing Setup Script for Mac/Linux
# This script helps configure .env.local for mobile testing

echo "=========================================="
echo "  GodlyWomen Mobile Testing Setup"
echo "=========================================="
echo ""

# Get IP Address (works on Mac and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
else
    # Linux
    IP=$(hostname -I | awk '{print $1}')
fi

echo ""
echo "Your Machine IP Address: $IP"
echo ""

# Backup existing .env.local
if [ -f .env.local ]; then
    echo "Backing up existing .env.local to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create new .env.local with IP address
cat > .env.local << EOF
# NextAuth Configuration
NEXTAUTH_URL=http://$IP:3000
NEXTAUTH_SECRET=2c1c36a8ff5ef77614b706d6839d3fc5

# Django API Configuration
NEXT_PUBLIC_DJANGO_API=http://$IP:8000
NEXT_PUBLIC_APP_URL=http://$IP:3000
EOF

echo ""
echo "✓ .env.local created with your IP address: $IP"
echo ""
echo "IMPORTANT: Make sure Django is running on ALL interfaces:"
echo "  python manage.py runserver 0.0.0.0:8000"
echo ""
echo "Then start Next.js:"
echo "  npm run dev"
echo ""
echo "Access from mobile:"
echo "  http://$IP:3000"
echo ""
echo "For Android Emulator, use instead in .env.local:"
echo "  NEXT_PUBLIC_DJANGO_API=http://10.0.2.2:8000"
echo ""
