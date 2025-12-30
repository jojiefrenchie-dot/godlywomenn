"""
AI API Views for text analysis and content generation
"""
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ai_services import (
    TextAnalyzer,
    CategoryTagger,
    DraftGenerator,
    generate_article,
    moderate_text,
)


# ==================== PRETRAINED MODEL ENDPOINTS ====================


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_article_endpoint(request):
    """
    Generate an article using FLAN-T5-Large model.
    
    POST /api/ai/generate/
    Request body:
    {
        "prompt": "Topic for the article",
        "max_words": 110  (optional, treated as character limit for short articles)
    }
    
    Response:
    {
        "article": "Generated article content...",
        "success": true
    }
    """
    try:
        prompt = request.data.get('prompt', '')
        max_words = request.data.get('max_words', None)
        
        if not prompt:
            return Response(
                {'error': 'Prompt is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate article using FLAN-T5
        article = generate_article(prompt, max_words=max_words)
        
        return Response({
            'article': article,
            'success': True,
        })
    except Exception as e:
        return Response(
            {'error': str(e), 'success': False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def moderate_content_endpoint(request):
    """
    Moderate text content using Detoxify model.
    Detects toxicity, obscenity, identity attacks, insults, and threats.
    
    POST /api/ai/moderate/
    Request body:
    {
        "text": "Content to moderate"
    }
    
    Response:
    {
        "is_toxic": false,
        "toxicity_score": 0.123,
        "labels": {...},
        "recommendation": "Content appears safe",
        "success": true
    }
    """
    try:
        text = request.data.get('text', '')
        
        if not text:
            return Response(
                {'error': 'Text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Moderate content using Detoxify
        moderation_result = moderate_text(text)
        
        return Response({
            **moderation_result,
            'success': True,
        })
    except Exception as e:
        return Response(
            {'error': str(e), 'success': False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== EXISTING ENDPOINTS ====================



@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_text(request):
    """Analyze text and return suggestions"""
    try:
        text = request.data.get('text', '')
        
        if not text:
            return Response(
                {'error': 'Text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get title improvements if it's short (likely a title)
        if len(text) < 200:
            suggestions = TextAnalyzer.suggest_title_improvements(text)
        else:
            suggestions = TextAnalyzer.extract_keywords(text)
        
        return Response({
            'analysis': suggestions,
            'keywords': TextAnalyzer.extract_keywords(text),
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_excerpt(request):
    """Analyze excerpt and return suggestions"""
    try:
        excerpt = request.data.get('excerpt', '')
        
        if not excerpt:
            return Response(
                {'error': 'Excerpt is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        suggestions = TextAnalyzer.suggest_excerpt_improvements(excerpt)
        
        return Response({
            'analysis': suggestions,
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def tag_content(request):
    """Tag content with relevant categories"""
    try:
        content = request.data.get('content', '')
        
        if not content:
            return Response(
                {'error': 'Content is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tags = CategoryTagger.suggest_categories(content)
        
        return Response({
            'tags': tags,
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_draft(request):
    """Generate a draft based on content and tone"""
    try:
        content = request.data.get('content', '')
        tone = request.data.get('tone', 'neutral')
        
        if not content:
            return Response(
                {'error': 'Content is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        draft = DraftGenerator.generate_draft(content, tone)
        
        return Response({
            'draft': draft,
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_recommendations(request):
    """Get article recommendations based on article ID"""
    try:
        article_id = request.query_params.get('articleId', '')
        
        if not article_id:
            return Response({
                'recommendations': [],
            })
        
        # Import here to avoid circular imports
        from articles.models import Article
        
        # Get the article
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({
                'recommendations': [],
            })
        
        # Get category-related articles
        related_articles = Article.objects.filter(
            category=article.category,
            status='published'
        ).exclude(id=article_id)[:5]
        
        recommendations = [
            {
                'id': str(art.id),
                'title': art.title,
                'slug': art.slug,
            }
            for art in related_articles
        ]
        
        return Response({
            'recommendations': recommendations,
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
