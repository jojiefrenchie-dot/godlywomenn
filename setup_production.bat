@echo off
REM Production setup script for Django backend (Windows)
REM Usage: setup_production.bat

echo.
echo ======================================
echo Godlywomen Production Setup Script
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo OK: %PYTHON_VERSION%

REM Create virtual environment
echo.
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate.bat

REM Install production dependencies
echo.
echo Installing production dependencies...
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements_production.txt

REM Generate Django secret key
echo.
echo Generating Django SECRET_KEY...
for /f "delims=" %%i in ('python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"') do set SECRET_KEY=%%i
echo SECRET_KEY=%SECRET_KEY%

REM Generate NextAuth secret (requires openssl or wsl)
echo.
echo For NEXTAUTH_SECRET, use this bash command:
echo   openssl rand -base64 32
echo Or generate one online at: https://generate-secret.vercel.app/32
echo.

REM Create .env.production.local template
echo.
echo Creating .env.production.local template...

(
    echo # Django Backend Configuration
    echo DJANGO_SECRET_KEY=%SECRET_KEY%
    echo DEBUG=False
    echo ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
    echo DATABASE_URL=postgresql://user:password@localhost:5432/godlywomen
    echo CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://yourdomain.vercel.app
    echo.
    echo # Next.js Frontend Configuration
    echo NEXTAUTH_URL=https://yourdomain.com
    echo NEXTAUTH_SECRET=GENERATE_WITH_COMMAND_ABOVE
    echo NEXT_PUBLIC_APP_URL=https://yourdomain.com
    echo NEXT_PUBLIC_DJANGO_API=https://api.yourdomain.com
) > .env.production.local.template

echo OK: Template created at .env.production.local.template
echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Review .env.production.local.template
echo 2. Update values for your domain
echo 3. Copy to .env.production.local (never commit this^!^)
echo 4. Run: python manage.py migrate
echo 5. Run: python manage.py createsuperuser
echo.
echo For Railway deployment:
echo   - Set environment variables in Railway dashboard
echo   - Push to GitHub and Railway will auto-deploy
echo.
echo For Vercel deployment:
echo   - Set environment variables in Vercel dashboard
echo   - Push to GitHub and Vercel will auto-deploy
echo.
pause
