from rest_framework import serializers
from .models import Article, Category, ArticleLike, Comment, CommentLike
from django.core.files.base import ContentFile
from django.utils.text import slugify
import os


class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description')
        read_only_fields = ('id', 'slug')
        
    def create(self, validated_data):
        # Always generate slug from name
        name = validated_data['name']
        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        
        # Ensure unique slug
        while Category.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
            
        validated_data['slug'] = slug
        return super().create(validated_data)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = getattr(__import__('articles.models', fromlist=['Tag']), 'Tag')
        fields = ('id', 'name', 'slug')


class ArticleSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    status = serializers.CharField(default='draft')
    published_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%dT%H:%M:%S%z")
    # created_at/updated_at are set by the model; mark them read-only so they're not required on input
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%dT%H:%M:%S%z")
    updated_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%dT%H:%M:%S%z")
    author = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    # Accept featured_image as either a file or a URL path string
    featured_image = serializers.SerializerMethodField(read_only=True)
    featured_image_url = serializers.CharField(write_only=True, required=False, allow_blank=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    user_liked = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Article
        fields = ('id', 'title', 'slug', 'content', 'excerpt', 'featured_image', 'featured_image_url', 'author', 
                 'category', 'category_id', 'status', 'view_count', 'created_at', 'updated_at', 'published_at', 
                 'likes_count', 'user_liked', 'comments')
        read_only_fields = ('id', 'view_count', 'created_at', 'updated_at', 'published_at', 'slug', 'author', 'featured_image', 
                           'likes_count', 'user_liked', 'comments')

    def create(self, validated_data):
        # Extract featured_image_url if provided
        featured_image_url = validated_data.pop('featured_image_url', None)
        
        # Convert category_id to category instance
        category_id = validated_data.pop('category_id', None)
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                validated_data['category'] = category
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category': 'Category does not exist'})

        # Generate unique slug from title
        base_slug = slugify(validated_data['title'])
        slug = base_slug
        counter = 1
        
        while Article.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
            
        validated_data['slug'] = slug

        # Set initial status to draft
        if 'status' not in validated_data:
            validated_data['status'] = 'draft'

        # Ensure content is never None
        if 'content' not in validated_data or validated_data['content'] is None:
            validated_data['content'] = ''
        
        # Log the data being saved
        print("Creating article with data:", {
            'title': validated_data.get('title'),
            'excerpt': validated_data.get('excerpt'),
            'content_length': len(validated_data.get('content', '')),
            'category_id': validated_data.get('category_id'),
            'status': validated_data.get('status'),
            'featured_image_url': featured_image_url,
        })

        article = super().create(validated_data)
        
        # If featured_image_url was provided, set it on the article
        if featured_image_url:
            # Store the URL directly in the featured_image field
            # Django's ImageField will store the relative path
            # Remove leading slash if present to get the relative path
            # Normalize provided URL: remove any leading slash and optional leading 'media/'
            relative_path = featured_image_url.lstrip('/')
            if relative_path.startswith('media/'):
                # strip the redundant media/ prefix so stored path is relative to MEDIA_ROOT
                relative_path = relative_path[len('media/'):]
            article.featured_image = relative_path
            article.save(update_fields=['featured_image'])
            print(f"Saved featured_image_url: {featured_image_url} -> {relative_path}")
            
        return article

    def update(self, instance, validated_data):
        # Extract featured_image_url if provided
        featured_image_url = validated_data.pop('featured_image_url', None)
        
        # Convert category_id to category instance if provided
        category_id = validated_data.pop('category_id', None)
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                validated_data['category'] = category
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category': 'Category does not exist'})

        # Update the instance with validated data
        article = super().update(instance, validated_data)
        
        # If featured_image_url was provided, update it
        if featured_image_url:
            relative_path = featured_image_url.lstrip('/')
            if relative_path.startswith('media/'):
                relative_path = relative_path[len('media/'):]
            article.featured_image = relative_path
            article.save(update_fields=['featured_image'])
            print(f"Updated featured_image_url: {featured_image_url} -> {relative_path}")
        
        return article

    def get_featured_image(self, obj):
        """Return the featured_image URL if it exists"""
        if obj.featured_image:
            # If featured_image already looks like a URL path, use it as-is
            featured_image_str = str(obj.featured_image)
            print(f"DEBUG: get_featured_image for {obj.id}: featured_image_str='{featured_image_str}'")
            if featured_image_str.startswith(('http://', 'https://', '/')):
                print(f"DEBUG: Returning as-is: {featured_image_str}")
                return featured_image_str
            # Otherwise, if it's a file field, get the URL
            if hasattr(obj.featured_image, 'url'):
                url = obj.featured_image.url
                print(f"DEBUG: Has .url attribute: {url}")
                return url
            # If the stored string already begins with 'media/', return with leading slash
            if featured_image_str.startswith('media/'):
                result = '/' + featured_image_str
                print(f"DEBUG: Featured image stored with media/: {result}")
                return result
            # Fallback: prepend media path
            result = f"/media/{featured_image_str}"
            print(f"DEBUG: Fallback with /media: {result}")
            return result
        print(f"DEBUG: get_featured_image for {obj.id}: No featured_image")
        return None

    def get_author(self, obj):
        if obj.author:
            return {
                'id': str(obj.author.id),
                'name': obj.author.name or obj.author.email,
                'image': obj.author.image,
            }
        return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_user_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_comments(self, obj):
        # Only get top-level comments (parent=None)
        comments = obj.comments.filter(parent=None)
        return CommentSerializer(comments, many=True, context=self.context).data
        
    def validate(self, attrs):
        errors = {}
        
        # If this is a status-only update, skip other validations
        if list(attrs.keys()) == ['status']:
            if attrs['status'] not in ['draft', 'published']:
                errors['status'] = ['Status must be either draft or published']
            return attrs

        # Required fields validation with custom messages
        required_fields = {
            'title': 'Please enter a title',
            'content': 'Please enter article content',
            'category_id': 'Please select a category'
        }
        
        # Optional fields with validation
        optional_fields = {
            'excerpt': 'Please enter a brief excerpt'
        }

        # For partial updates, only validate fields that are being updated
        if self.partial:
            required_fields = {
                field: msg for field, msg in required_fields.items()
                if field in attrs
            }

        # Validate image file
        featured_image = attrs.get('featured_image')
        if featured_image:
            # Check file size (limit to 5MB)
            if featured_image.size > 5 * 1024 * 1024:
                errors['featured_image'] = ['Image file too large. Size should not exceed 5MB.']
            
            # Check file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif']
            if featured_image.content_type not in allowed_types:
                errors['featured_image'] = ['Unsupported image format. Please use JPEG, PNG or GIF.']
        
        # Validate required fields
        for field, message in required_fields.items():
            if field not in attrs or not attrs[field]:
                errors[field] = [message]
                
        # Validate optional fields if they are provided
        for field, message in optional_fields.items():
            if field in attrs and attrs[field] and len(attrs[field].strip()) == 0:
                errors[field] = [message]
        
        # Additional validation
        if attrs.get('title'):
            if len(attrs['title']) > 1024:
                errors['title'] = ['Title must be less than 1024 characters']
            elif len(attrs['title']) < 3:
                errors['title'] = ['Title must be at least 3 characters long']
                
        if attrs.get('content'):
            if len(attrs['content']) < 10:
                errors['content'] = ['Content is too short']
                
        if attrs.get('excerpt'):
            if len(attrs['excerpt']) > 500:
                errors['excerpt'] = ['Excerpt must be less than 500 characters']
        
        # Validate category exists
        if 'category' in attrs:
            try:
                category = Category.objects.get(id=attrs['category'])
            except Category.DoesNotExist:
                errors['category'] = ['Category does not exist.']
            except (TypeError, ValueError):
                errors['category'] = ['Invalid category ID format.']
        
        # Validate content is not too long (if your database has a limit)
        if len(attrs.get('content', '')) > 100000:  # Adjust limit as needed
            errors['content'] = ['Content is too long.']
            
        if errors:
            raise serializers.ValidationError(errors)
            
        return attrs


class ArticleLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleLike
        fields = ('id', 'user', 'article', 'created_at')
        read_only_fields = ('id', 'created_at')


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ('id', 'user', 'comment', 'created_at')
        read_only_fields = ('id', 'created_at')


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'article', 'author', 'content', 'parent', 'created_at', 'updated_at', 'likes_count', 'user_liked', 'replies')
        read_only_fields = ('id', 'article', 'author', 'created_at', 'updated_at', 'likes_count', 'user_liked', 'replies')

    def get_author(self, obj):
        if obj.author:
            return {
                'id': str(obj.author.id),
                'name': obj.author.name or obj.author.email,
                'image': obj.author.image,
            }
        return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_user_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True, context=self.context).data
