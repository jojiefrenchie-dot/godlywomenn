"""
URL configuration for backend_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from datetime import datetime, timedelta

@csrf_exempt
def auth_login(request):
    """Simple JWT login endpoint for testing"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'message': 'Email and password required'}, status=400)
            
            # Mock auth - accept any email/password for testing
            user_id = f'user_{hash(email) % 10000}'
            
            # Generate JWT tokens
            secret = 'your-secret-key'
            payload = {
                'user_id': user_id,
                'email': email,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }
            access_token = jwt.encode(payload, secret, algorithm='HS256')
            
            refresh_payload = {
                'user_id': user_id,
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=7)
            }
            refresh_token = jwt.encode(refresh_payload, secret, algorithm='HS256')
            
            return JsonResponse({
                'user': {
                    'id': user_id,
                    'email': email,
                    'name': 'Test User'
                },
                'access': access_token,
                'refresh': refresh_token
            })
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def auth_register(request):
    """Register a new user"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')
            
            if not email or not password:
                return JsonResponse({'message': 'Email and password required'}, status=400)
            
            # Mock registration - just create user data
            user_id = f'user_{hash(email) % 10000}'
            
            # Generate JWT tokens
            secret = 'your-secret-key'
            payload = {
                'user_id': user_id,
                'email': email,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }
            access_token = jwt.encode(payload, secret, algorithm='HS256')
            
            refresh_payload = {
                'user_id': user_id,
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=7)
            }
            refresh_token = jwt.encode(refresh_payload, secret, algorithm='HS256')
            
            return JsonResponse({
                'message': 'User registered successfully',
                'user': {
                    'id': user_id,
                    'email': email,
                    'name': name or 'Test User'
                },
                'access': access_token,
                'refresh': refresh_token
            }, status=201)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def auth_me(request):
    """Get current user info from JWT token"""
    if request.method == 'GET':
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'message': 'Unauthorized'}, status=401)
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            secret = 'your-secret-key'
            
            # Decode JWT token
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            
            return JsonResponse({
                'user': {
                    'id': payload.get('user_id'),
                    'email': payload.get('email'),
                    'name': 'Test User'
                }
            })
        except jwt.ExpiredSignatureError:
            return JsonResponse({'message': 'Token expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'message': 'Invalid token'}, status=401)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=401)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def user_stats(request, user_id):
    """Get user stats"""
    if request.method == 'GET':
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            secret = 'your-secret-key'
            
            # Decode JWT token
            try:
                payload = jwt.decode(token, secret, algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            # Return user stats
            return JsonResponse({
                'articlesRead': 0,
                'prayersPosted': 0,
                'daysActive': 0
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=401)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def user_activity(request, user_id):
    """Get user activity stream"""
    if request.method == 'GET':
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'No access token found'}, status=401)
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            secret = 'your-secret-key'
            
            # Decode JWT token
            try:
                payload = jwt.decode(token, secret, algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                return JsonResponse({'error': 'Invalid token'}, status=401)
            
            # Return empty activity list
            return JsonResponse([], safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def articles_list(request):
    """List all articles"""
    if request.method == 'GET':
        return JsonResponse([], safe=False)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def marketplace_list(request):
    """List and create marketplace items"""
    if request.method == 'GET':
        # Return empty list of marketplace items
        return JsonResponse([], safe=False)
    elif request.method == 'POST':
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Unauthorized', 'detail': 'No Bearer token'}, status=401)
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            secret = 'your-secret-key'
            
            # Decode JWT token
            try:
                payload = jwt.decode(token, secret, algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
                return JsonResponse({'error': 'Unauthorized', 'detail': str(e)}, status=401)
            
            # Parse request body
            try:
                if request.body:
                    data = json.loads(request.body)
                else:
                    data = {}
            except json.JSONDecodeError as e:
                return JsonResponse({'error': 'Invalid JSON', 'detail': str(e)}, status=400)
            
            # Create marketplace item (mock - no DB)
            item_id = f'item_{hash(str(data)) % 10000}'
            
            return JsonResponse({
                'id': item_id,
                'title': data.get('title', ''),
                'description': data.get('description', ''),
                'price': data.get('price'),
                'currency': data.get('currency'),
                'type': data.get('type', 'Product'),
                'date': data.get('date'),
                'contact': data.get('contact'),
                'countryCode': data.get('countryCode'),
                'image': data.get('image'),
                'owner': {
                    'id': payload.get('user_id'),
                    'email': payload.get('email'),
                    'name': 'Test User'
                }
            }, status=201)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': 'Server error', 'detail': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt
def marketplace_detail(request, item_id):
    """Get, update, or delete a marketplace item"""
    if request.method == 'GET':
        try:
            # Return empty item (mock - no DB)
            return JsonResponse({
                'id': item_id,
                'title': '',
                'description': '',
                'price': None,
                'currency': None,
                'type': 'Product',
                'date': None,
                'contact': None,
                'countryCode': None,
                'image': None,
                'owner': {
                    'id': 'user_1',
                    'email': 'test@example.com',
                    'name': 'Test User'
                }
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'PATCH':
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            secret = 'your-secret-key'
            
            # Decode JWT token
            try:
                payload = jwt.decode(token, secret, algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            # Parse request body
            data = json.loads(request.body)
            
            # Update marketplace item (mock - no DB)
            return JsonResponse({
                'id': item_id,
                'title': data.get('title', ''),
                'description': data.get('description', ''),
                'price': data.get('price'),
                'currency': data.get('currency'),
                'type': data.get('type', 'Product'),
                'date': data.get('date'),
                'contact': data.get('contact'),
                'countryCode': data.get('countryCode'),
                'image': data.get('image'),
                'owner': {
                    'id': payload.get('user_id'),
                    'email': payload.get('email'),
                    'name': 'Test User'
                }
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'DELETE':
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            token = auth_header[7:]  # Remove 'Bearer ' prefix
            secret = 'your-secret-key'
            
            # Decode JWT token
            try:
                jwt.decode(token, secret, algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            
            # Delete marketplace item (mock - no DB)
            return JsonResponse({'message': 'Item deleted'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'message': 'Method not allowed'}, status=405)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', auth_login, name='auth_login'),
    path('api/auth/register/', auth_register, name='auth_register'),
    path('api/auth/me/', auth_me, name='auth_me'),
    path('api/auth/<str:user_id>/stats', user_stats, name='user_stats'),
    path('api/user/<str:user_id>/activity', user_activity, name='user_activity'),
    path('api/articles/', articles_list, name='articles_list'),
    path('api/marketplace/', marketplace_list, name='marketplace_list'),
    path('api/marketplace/<str:item_id>/', marketplace_detail, name='marketplace_detail'),
]
