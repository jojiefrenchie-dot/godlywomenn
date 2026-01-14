from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from .models import User
import os
from django.conf import settings


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print(f"[REGISTER] Request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"[REGISTER] Validation errors: {serializer.errors}")
            return Response({'message': 'Validation failed', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = serializer.save()
            print(f"[REGISTER] ✓ User created: {user.email}")
            print(f"[REGISTER] User ID: {user.id}")
            print(f"[REGISTER] User is_active: {user.is_active}")
            
            # Verify password was set correctly
            print(f"[REGISTER] Password hash length: {len(user.password) if user.password else 0}")
            
            data = UserSerializer(user).data
            return Response({'message': 'User created', 'user': data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"[REGISTER] ✗ Error creating user: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'message': str(e), 'error': 'User creation failed'}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'
    lookup_url_kwarg = 'user_id'

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound('User not found')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_profile_image(request):
    """Upload user profile image and save URL to user model"""
    try:
        user = request.user
        image_file = request.FILES.get('image')
        
        if not image_file:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create media directory if it doesn't exist
        media_root = settings.MEDIA_ROOT
        os.makedirs(media_root, exist_ok=True)
        
        # Save the file with a unique name
        filename = f"user_profiles/{user.id}_{image_file.name}"
        filepath = os.path.join(media_root, filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Write the file
        with open(filepath, 'wb') as f:
            for chunk in image_file.chunks():
                f.write(chunk)
        
        # Store the URL path
        image_url = f"/media/{filename}"
        user.image = image_url
        user.save()
        
        print(f"[IMAGE_UPLOAD] ✓ Image uploaded for user {user.email}")
        print(f"[IMAGE_UPLOAD] File: {filename}")
        print(f"[IMAGE_UPLOAD] URL: {image_url}")
        
        return Response({
            'image': image_url,
            'message': 'Image uploaded successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"[IMAGE_UPLOAD] ✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)