from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')

    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate(self, data):
        """Additional validation"""
        if not data.get('name'):
            raise serializers.ValidationError({'name': 'Name is required'})
        if not data.get('password'):
            raise serializers.ValidationError({'password': 'Password is required'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        try:
            email = validated_data.get('email')
            print(f"[REGISTER SERIALIZER] Creating user")
            print(f"[REGISTER SERIALIZER]   Email: {email}")
            print(f"[REGISTER SERIALIZER]   Password length: {len(password) if password else 0}")
            print(f"[REGISTER SERIALIZER]   Password: {password}")
            user = User.objects.create_user(password=password, **validated_data)
            print(f"[REGISTER SERIALIZER] ✓ User created successfully: {user.email}")
            
            # Verify the password was set correctly
            is_correct = user.check_password(password)
            print(f"[REGISTER SERIALIZER] Password verification: {is_correct}")
            
            return user
        except Exception as e:
            print(f"[REGISTER SERIALIZER] ✗ Error: {str(e)}")
            raise serializers.ValidationError({'detail': str(e)})


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD  # This is 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace the 'username' field with 'email' field
        self.fields[self.username_field] = serializers.EmailField()
        if 'username' in self.fields and self.username_field != 'username':
            del self.fields['username']
    
    def validate(self, attrs):
        """Override to properly handle email-based authentication"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        print(f"[TOKEN SERIALIZER] Validating email: {email}")
        
        if not email or not password:
            raise serializers.ValidationError("Email and password are required")
        
        try:
            # Get user by email
            user = User.objects.get(email=email)
            print(f"[TOKEN SERIALIZER] User found: {user.email}, is_active: {user.is_active}")
            
            # Check password
            if not user.check_password(password):
                print(f"[TOKEN SERIALIZER] Password mismatch for user {email}")
                raise serializers.ValidationError("Invalid email or password")
            
            if not user.is_active:
                print(f"[TOKEN SERIALIZER] User is inactive: {email}")
                raise serializers.ValidationError("User account is inactive")
            
            # Generate tokens manually
            refresh = RefreshToken.for_user(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            print(f"[TOKEN SERIALIZER] ✓ Authentication successful for {email}")
            return data
            
        except User.DoesNotExist:
            print(f"[TOKEN SERIALIZER] User not found: {email}")
            raise serializers.ValidationError("Invalid email or password")
        except Exception as e:
            print(f"[TOKEN SERIALIZER] ✗ Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'image', 'bio', 'location', 'website', 'facebook', 'twitter', 'instagram', 'created_at')
        read_only_fields = ('id', 'created_at')
