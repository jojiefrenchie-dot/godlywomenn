from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from .models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print(f"[REGISTER] Request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"[REGISTER] Validation errors: {serializer.errors}")
            raise serializers.ValidationError(serializer.errors)
        
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
