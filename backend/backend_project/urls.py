from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from articles.views import CategoryListView, TagListView
from ai_views import (
    analyze_text,
    analyze_excerpt,
    tag_content,
    generate_draft,
    get_recommendations,
    generate_article_endpoint,
    moderate_content_endpoint,
)


def index(request):
        html = '''
        <html><head><title>API Index</title></head><body>
            <h1>Godlywomen API</h1>
            <ul>
                <li><a href="/admin/">/admin/</a></li>
                <li><a href="/api/auth/">/api/auth/</a></li>
                <li><a href="/api/articles/">/api/articles/</a></li>
                <li><a href="/api/categories/">/api/categories/</a></li>
                <li><a href="/api/tags/">/api/tags/</a></li>
                <li><a href="/api/ai/">/api/ai/</a></li>
            </ul>
        </body></html>
        '''
        return HttpResponse(html)


def health(request):
        """Health check endpoint for monitoring and testing API connectivity"""
        return HttpResponse('{"status": "ok"}', content_type='application/json')


urlpatterns = [
        path('', index),
        path('health/', health),
        path('admin/', admin.site.urls),
        path('api/auth/', include('users.urls')),
        path('api/articles/', include('articles.urls')),
        path('api/prayers/', include('prayers.urls')),
        path('api/marketplace/', include('marketplace.urls')),
        path('api/messaging/', include('messaging.urls')),
        # Pretrained AI model endpoints
        path('api/ai/generate/', generate_article_endpoint),
        path('api/ai/moderate/', moderate_content_endpoint),
        # Existing AI API endpoints
        path('api/ai/analyze-text/', analyze_text),
        path('api/ai/analyze-excerpt/', analyze_excerpt),
        path('api/ai/tagging/', tag_content),
        path('api/ai/generate-draft/', generate_draft),
        path('api/ai/recommendations/', get_recommendations),
        # top-level alias expected by the frontend
        path('api/categories/', CategoryListView.as_view()),
        path('api/tags/', TagListView.as_view()),
]

from django.conf import settings
from django.conf.urls.static import static

# Serve static and media files only in development (DEBUG=True)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
