from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db import models, transaction
from .models import Article, Category, ArticleLike, Comment, CommentLike, Tag
from .serializers import ArticleSerializer, CategorySerializer, ArticleLikeSerializer, CommentSerializer, CommentLikeSerializer, TagSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
class ArticleLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        # Only allow liking published articles
        if article.status != 'published':
            return Response(
                {'detail': 'Cannot like unpublished articles.'},
                status=status.HTTP_403_FORBIDDEN
            )
        like, created = ArticleLike.objects.get_or_create(user=request.user, article=article)
        if created:
            return Response({'detail': 'Article liked.'}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Already liked.'}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        # Only allow unliking published articles
        if article.status != 'published':
            return Response(
                {'detail': 'Cannot unlike unpublished articles.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            like = ArticleLike.objects.get(user=request.user, article=article)
            like.delete()
            return Response({'detail': 'Article unliked.'}, status=status.HTTP_204_NO_CONTENT)
        except ArticleLike.DoesNotExist:
            return Response({'detail': 'Like not found.'}, status=status.HTTP_404_NOT_FOUND)


class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        print(f'\n=== CREATE COMMENT REQUEST ===')
        print(f'Article ID: {pk}')
        print(f'User: {request.user}')
        print(f'Request data: {request.data}')
        
        article = get_object_or_404(Article, pk=pk)
        
        # Only allow comments on published articles
        if article.status != 'published':
            return Response(
                {'detail': 'Cannot comment on unpublished articles.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        print(f'Article found: {article.title}')
        
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    comment = serializer.save(author=request.user, article=article)
                    print(f'✓ Comment created: {comment.id}')
                    print(f'  Content: {comment.content[:50]}...')
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f'✗ Database error: {str(e)}')
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f'✗ Serializer errors: {serializer.errors}')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        like, created = CommentLike.objects.get_or_create(user=request.user, comment=comment)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        try:
            like = CommentLike.objects.get(user=request.user, comment=comment)
            like.delete()
            serializer = CommentSerializer(comment, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CommentLike.DoesNotExist:
            return Response({'detail': 'Like not found.'}, status=status.HTTP_404_NOT_FOUND)


class CommentReplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        parent_comment = get_object_or_404(Comment, pk=pk)
        article = parent_comment.article
        
        # Only allow replies on comments from published articles
        if article.status != 'published':
            return Response(
                {'detail': 'Cannot reply to comments on unpublished articles.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user, article=parent_comment.article, parent=parent_comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        print(f'\n>>> DELETE COMMENT: pk={pk}, user={request.user.id}')
        try:
            comment = Comment.objects.get(pk=pk)
            print(f'  Found comment {comment.id} by user {comment.author_id}')
            
            # Only allow deletion by the comment author
            if comment.author_id != request.user.id:
                print(f'  FORBIDDEN: User {request.user.id} cannot delete comment by {comment.author_id}')
                return Response(
                    {'detail': 'You can only delete your own comments.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            comment.delete()
            print(f'  SUCCESS: Comment {pk} deleted')
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Comment.DoesNotExist:
            print(f'  NOT FOUND: Comment {pk} does not exist')
            return Response(
                {'detail': 'Comment not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f'  ERROR: {str(e)}')
            return Response(
                {'detail': f'Error deleting comment: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArticleListCreateView(generics.ListCreateAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = Article.objects.all().select_related('category', 'author')
        
        # Handle slug filtering
        slug = self.request.query_params.get('slug', None)
        if slug is not None:
            # For slug filtering, only return published articles or user's own drafts
            if self.request.user.is_authenticated:
                queryset = queryset.filter(
                    models.Q(slug=slug) &
                    (models.Q(status='published') | 
                     models.Q(status='draft', author=self.request.user))
                )
            else:
                queryset = queryset.filter(slug=slug, status='published')
            return queryset
            
        # Handle author filtering
        author_id = self.request.query_params.get('author', None)
        if author_id is not None:
            # For author filtering, show all articles if viewing own articles or includeAll is true
            if str(self.request.user.id) == str(author_id) or self.request.query_params.get('includeAll', None):
                queryset = queryset.filter(author_id=author_id)
            else:
                queryset = queryset.filter(author_id=author_id, status='published')
            return queryset.order_by('-created_at')

        # Handle search filtering
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(content__icontains=search) |
                models.Q(excerpt__icontains=search)
            )

        # Handle category filtering
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # If includeAll is set, return all articles for authenticated users
        include_all = self.request.query_params.get('includeAll', None)
        if include_all and self.request.user.is_authenticated:
            return queryset.order_by('-created_at')

        # Default case: return only published articles
        return queryset.filter(status='published').order_by('-created_at')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        print("Received article creation request data:", request.data)  # Debug print
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        try:
            print("Creating article with author:", self.request.user)  # Debug print
            print("Request data:", self.request.data)  # Debug print
            
            # Wrap in transaction to ensure atomic save
            with transaction.atomic():
                serializer.save(author=self.request.user)
                print("✓ Article saved successfully")
                
        except Exception as e:
            import logging
            logging.error(f"Error creating article: {str(e)}", exc_info=True)
            logging.error(f"Request data: {self.request.data}")
            raise


class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        # For authenticated users, allow access to published articles and their own drafts
        if self.request.user.is_authenticated:
            return Article.objects.filter(
                models.Q(status='published') | 
                (models.Q(status='draft') & models.Q(author=self.request.user))
            )
        # For anonymous users, only allow access to published articles
        return Article.objects.filter(status='published')

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track the view if the user is authenticated and not the author
        if request.user.is_authenticated and request.user != instance.author:
            from .models import ArticleView
            ArticleView.objects.get_or_create(
                user=request.user,
                article=instance,
                defaults={'created_at': timezone.now()}
            )
            # Increment view count
            instance.view_count = instance.view_count + 1
            instance.save(update_fields=['view_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_update(self, serializer):
        # Only allow the author to update their own articles
        if self.request.user != serializer.instance.author:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own articles.")

        # For status-only updates, skip other validations
        if list(self.request.data.keys()) == ['status']:
            serializer.save(status=self.request.data['status'])
            return

        serializer.save()

    def perform_destroy(self, instance):
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Request user: {self.request.user} (ID: {self.request.user.id})")
        logger.info(f"Article author: {instance.author} (ID: {instance.author.id})")
        
        # Only allow the author to delete their own articles
        if str(self.request.user.id) != str(instance.author.id):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own articles.")
        
        instance.delete()


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]  # Explicitly allow unauthenticated access for GET requests
        
    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return response
        except Exception as e:
            import logging
            logging.error(f"Error creating category: {str(e)}")
            raise


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]


class ArticleImageUploadView(generics.CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES.get('featured_image')
            if not file_obj:
                return Response({'detail': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif']
            if file_obj.content_type not in allowed_types:
                return Response(
                    {'detail': 'Unsupported file type. Please upload JPEG, PNG or GIF images.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate file size (5MB limit)
            if file_obj.size > 5 * 1024 * 1024:  # 5MB in bytes
                return Response(
                    {'detail': 'File too large. Size should not exceed 5MB.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a temporary article instance to use ImageField storage
            article = Article(author=request.user)
            # Save file to storage via ImageField
            article.featured_image.save(file_obj.name, file_obj, save=False)

            print(f"[IMAGE UPLOAD] Image saved for temporary article")
            print(f"[IMAGE UPLOAD] Featured image path: {article.featured_image}")
            print(f"[IMAGE UPLOAD] Featured image URL: {article.featured_image.url if hasattr(article.featured_image, 'url') else 'N/A'}")

            # Determine a normalized URL to return (always start with '/media/')
            try:
                url = article.featured_image.url
            except Exception as e:
                print(f"[IMAGE UPLOAD] Error getting URL from field: {e}")
                # Fallback: build URL from stored name
                stored = str(article.featured_image)
                stored = stored.lstrip('/')
                if stored.startswith('media/'):
                    stored = stored[len('media/'):]
                url = '/media/' + stored

            # Ensure leading slash
            if not url.startswith('/'):
                url = '/' + url

            print(f"[IMAGE UPLOAD] Returning URL: {url}")
            return Response({'url': url}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"[IMAGE UPLOAD] Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ArticleGenerateContentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Generate article content using AI"""
        try:
            try:
                # Prefer absolute import to avoid relative import issues
                from backend.ai_services import generate_article
            except Exception:
                # Fallback to direct module import if package name differs
                import ai_services
                generate_article = ai_services.generate_article
            
            prompt = request.data.get('prompt', '')
            topic = request.data.get('topic', '')
            max_words = request.data.get('max_words', 800)
            
            if not prompt:
                return Response(
                    {'error': 'Prompt is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate content
            generated_text = generate_article(f"{prompt} - {topic}", max_words)
            
            if not generated_text:
                return Response(
                    {'error': 'Failed to generate content'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Convert to HTML (wrap in paragraphs)
            html_content = ""
            paragraphs = generated_text.split('\n')
            for para in paragraphs:
                if para.strip():
                    html_content += f"<p>{para.strip()}</p>"
            
            # Create excerpt (first 150 chars)
            excerpt = generated_text[:150].strip()
            if len(generated_text) > 150:
                excerpt += "..."
            
            return Response(
                {
                    'content': html_content,
                    'excerpt': excerpt,
                    'generated_text': generated_text
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
