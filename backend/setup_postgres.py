#!/usr/bin/env python
"""
PostgreSQL Setup and Migration Script
Sets up PostgreSQL for local development and runs migrations
"""
import os
import sys
import subprocess
import django
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
sys.path.insert(0, os.path.dirname(__file__))

print("=" * 70)
print("PostgreSQL Setup and Migration Script")
print("=" * 70)

# Check if PostgreSQL is installed
print("\n[1] Checking PostgreSQL installation...")
try:
    result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
    print(f"    ✓ PostgreSQL found: {result.stdout.strip()}")
    pg_installed = True
except FileNotFoundError:
    print("    ✗ PostgreSQL not found. Please install PostgreSQL first:")
    print("      Windows: https://www.postgresql.org/download/windows/")
    print("      macOS: brew install postgresql")
    print("      Linux: sudo apt-get install postgresql")
    pg_installed = False

if not pg_installed:
    print("\n⚠ Cannot proceed without PostgreSQL installed.")
    sys.exit(1)

# Database configuration
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'godlywomen_db')
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', '')

print(f"\n[2] Database Configuration:")
print(f"    Host: {DB_HOST}")
print(f"    Port: {DB_PORT}")
print(f"    Database: {DB_NAME}")
print(f"    User: {DB_USER}")

# Create .env file if needed
print("\n[3] Checking environment configuration...")
env_file = Path(os.path.dirname(__file__)).parent.parent / '.env'
env_local = Path(os.path.dirname(__file__)).parent / '.env.local'

if not env_file.exists() and not env_local.exists():
    print("    ⚠ No .env file found. Creating template...")
    env_content = f"""# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME={DB_NAME}
DB_USER={DB_USER}
DB_PASSWORD=your_password_here

# Django
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
"""
    env_file.write_text(env_content)
    print(f"    ✓ Created {env_file}")
    print("    ⚠ Please update DB_PASSWORD and DJANGO_SECRET_KEY in the .env file")
else:
    print("    ✓ Environment file found")

# Test connection
print("\n[4] Testing PostgreSQL connection...")
if DB_PASSWORD:
    os.environ['PGPASSWORD'] = DB_PASSWORD
    conn_cmd = f"psql -h {DB_HOST} -p {DB_PORT} -U {DB_USER} -d postgres -c 'SELECT 1;'"
    try:
        result = subprocess.run(conn_cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print("    ✓ PostgreSQL connection successful")
        else:
            print(f"    ✗ Connection failed: {result.stderr}")
            sys.exit(1)
    except Exception as e:
        print(f"    ✗ Error: {e}")
        sys.exit(1)
else:
    print("    ⚠ DB_PASSWORD not set. Attempting with peer authentication...")

# Create database
print(f"\n[5] Creating database '{DB_NAME}'...")
create_db_cmd = f"psql -h {DB_HOST} -p {DB_PORT} -U {DB_USER} -c \"CREATE DATABASE {DB_NAME} ENCODING 'UTF-8';\""
try:
    result = subprocess.run(create_db_cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0 or "already exists" in result.stderr:
        print(f"    ✓ Database '{DB_NAME}' ready")
    else:
        print(f"    ⚠ {result.stderr.strip()}")
except Exception as e:
    print(f"    ✗ Error: {e}")

# Run Django migrations
print("\n[6] Running Django migrations...")
django.setup()
from django.core.management import call_command

try:
    call_command('migrate', verbosity=2)
    print("    ✓ Migrations completed")
except Exception as e:
    print(f"    ✗ Migration error: {e}")
    sys.exit(1)

print("\n" + "=" * 70)
print("✓ PostgreSQL Setup Complete!")
print("=" * 70)
print("\nYour application is now using PostgreSQL.")
print(f"Connection: postgresql://{DB_USER}:****@{DB_HOST}:{DB_PORT}/{DB_NAME}")
print("\nTo run the development server:")
print("  python manage.py runserver")
