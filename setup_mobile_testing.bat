@echo off
REM Mobile Testing Setup Script for Windows
REM This script helps configure .env.local for mobile testing

echo ==========================================
echo  GodlyWomen Mobile Testing Setup
echo ==========================================
echo.

REM Get IP Address
for /f "tokens=2 delims=: " %%a in ('ipconfig ^| findstr /R "IPv4 Address"') do (
    if not "!foundIP!"=="1" (
        set IP=%%a
        set foundIP=1
    )
)

echo.
echo Your Machine IP Address: %IP%
echo.

REM Create .env.local if it doesn't exist, or backup the old one
if exist .env.local (
    echo Backing up existing .env.local to .env.local.backup
    copy .env.local .env.local.backup > nul
)

REM Create new .env.local with IP address
(
    echo # NextAuth Configuration
    echo NEXTAUTH_URL=http://%IP%:3000
    echo NEXTAUTH_SECRET=2c1c36a8ff5ef77614b706d6839d3fc5
    echo.
    echo # Django API Configuration
    echo NEXT_PUBLIC_DJANGO_API=http://%IP%:8000
    echo NEXT_PUBLIC_APP_URL=http://%IP%:3000
) > .env.local

echo.
echo ✓ .env.local created with your IP address: %IP%
echo.
echo IMPORTANT: Make sure Django is running on ALL interfaces:
echo   python manage.py runserver 0.0.0.0:8000
echo.
echo Then start Next.js:
echo   npm run dev
echo.
echo Access from mobile:
echo   http://%IP%:3000
echo.
echo For Android Emulator, use instead:
echo   NEXT_PUBLIC_DJANGO_API=http://10.0.2.2:8000
echo.
pause
