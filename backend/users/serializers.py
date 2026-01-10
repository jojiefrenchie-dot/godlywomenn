from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
            print(f"[REGISTER SERIALIZER] Creating user with email: {validated_data.get('email')}")
            user = User.objects.create_user(password=password, **validated_data)
            print(f"[REGISTER SERIALIZER] ✓ User created successfully")
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
        # SimpleJWT expects attrs with the username_field (which is 'email')
        print(f"[TOKEN SERIALIZER] Attempting authentication with email: {attrs.get('email', 'NO_EMAIL')}")
        try:
            validated = super().validate(attrs)
            print(f"[TOKEN SERIALIZER] Authentication successful")
            return validated
        except Exception as e:
            print(f"[TOKEN SERIALIZER] Authentication failed: {str(e)}")
            print(f"[TOKEN SERIALIZER] Fields: {list(attrs.keys())}")
            raise


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'image', 'bio', 'location', 'website', 'facebook', 'twitter', 'instagram', 'created_at')
        read_only_fields = ('id', 'created_at')
