from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


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
