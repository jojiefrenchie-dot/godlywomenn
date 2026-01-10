from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Return password reset link"""
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Generate token and uid
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Return reset link (frontend can use this)
    # Use production URL in production, localhost in development
    frontend_url = "https://godlywomenn.vercel.app" if "onrender.com" in request.build_absolute_uri() else "http://localhost:3000"
    reset_url = f"{frontend_url}/reset-password?uid={uid}&token={token}"
    
    return Response({'resetUrl': reset_url, 'message': 'Reset link generated'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password with token"""
    uid = request.data.get('uid')
    token = request.data.get('token')
    password = request.data.get('password')
    
    if not all([uid, token, password]):
        return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        from django.utils.http import urlsafe_base64_decode
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id)
    except:
        return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify token
    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update password
    user.set_password(password)
    user.save()
    
    return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)

