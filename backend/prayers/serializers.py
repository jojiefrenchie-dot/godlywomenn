from rest_framework import serializers
from .models import Prayer, PrayerResponse, PrayerSupport
from users.serializers import UserSerializer

class PrayerResponseSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    has_user_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = PrayerResponse
        fields = ['id', 'prayer', 'author', 'content', 'created_at', 'updated_at', 'likes_count', 'has_user_liked']
        read_only_fields = ['author', 'prayer']
        
    def get_likes_count(self, obj):
        return obj.likes.count()
        
    def get_has_user_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class PrayerSupportSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PrayerSupport
        fields = ['id', 'prayer', 'user', 'created_at']
        read_only_fields = ['user']

class PrayerSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    responses = PrayerResponseSerializer(many=True, read_only=True)
    supporters_count = serializers.SerializerMethodField()
    has_user_supported = serializers.SerializerMethodField()
    
    class Meta:
        model = Prayer
        fields = [
            'id', 'title', 'content', 'prayer_type', 'is_anonymous', 'is_public',
            'author', 'created_at', 'updated_at', 'responses', 'supporters_count',
            'has_user_supported'
        ]
        read_only_fields = ['author']
        
    def get_supporters_count(self, obj):
        return obj.supporters.count()
        
    def get_has_user_supported(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.supporters.filter(user=request.user).exists()
        return False