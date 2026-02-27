# Godly Women - Backend API Configuration

Backend is hosted on Render at: https://godlywomenn.onrender.com

## API Documentation

### Authentication Endpoints
- POST `/api/auth/login/` - User login
- POST `/api/auth/register/` - User registration  
- POST `/api/auth/logout/` - User logout
- GET `/api/auth/me/` - Get current user profile
- POST `/api/auth/forgot-password/` - Password reset request

### Environment Variables
- `NEXT_PUBLIC_DJANGO_API` - Django backend URL (defaults to https://godlywomenn.onrender.com)

### Local Development
To run the backend locally:
```bash
python manage.py runserver 8000
```

The frontend will automatically connect to the backend using the `NEXT_PUBLIC_DJANGO_API` environment variable.
