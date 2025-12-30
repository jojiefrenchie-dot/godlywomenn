from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from articles.models import Article, ArticleView
from articles.serializers import ArticleSerializer
from django.utils import timezone

class ArticleBySlugView(APIView):
    def get(self, request, slug):
        try:
            # For authenticated users, allow access to published articles and their own drafts
            if request.user.is_authenticated:
                try:
                    # Try to get the article
                    article = Article.objects.select_related('category', 'author').get(slug=slug)
                    # If it's a draft, ensure it belongs to the user
                    if article.status == 'draft' and article.author != request.user:
                        raise Http404
                except Article.DoesNotExist:
                    raise Http404
            else:
                # For anonymous users, only allow access to published articles
                article = Article.objects.select_related('category', 'author').get(
                    slug=slug, 
                    status='published'
                )
            
            # Debug logging
            print(f"Article retrieved - Title: {article.title}")
            print(f"Content length: {len(article.content) if article.content else 0}")
            print(f"Content type: {type(article.content)}")
            print(f"Status: {article.status}")
            
            # Track the view if the user is authenticated and not the author
            if request.user.is_authenticated and request.user != article.author:
                ArticleView.objects.get_or_create(
                    user=request.user,
                    article=article,
                    defaults={'created_at': timezone.now()}
                )
                # Increment view count
                article.view_count = article.view_count + 1
                article.save(update_fields=['view_count'])
            
            serializer = ArticleSerializer(article)
            response_data = serializer.data
            
            # Log the response data for debugging
            print("Article data being sent:", {
                'id': response_data.get('id'),
                'title': response_data.get('title'),
                'content_length': len(response_data.get('content', '')),
                'has_content': bool(response_data.get('content')),
                'status': response_data.get('status')
            })
            
            return Response(response_data)
            
        except Article.DoesNotExist:
            raise Http404
        except Exception as e:
            print(f"Error fetching article: {str(e)}")
            return Response(
                {"error": "Failed to retrieve article"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )