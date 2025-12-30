from django.urls import path
from .views import (
    ArticleListCreateView,
    ArticleDetailView,
    CategoryListView,
    TagListView,
    ArticleImageUploadView,
    ArticleLikeView,
    CommentCreateView,
    CommentLikeView,
    CommentReplyView,
    CommentDeleteView,
    ArticleGenerateContentView
)
from .views_article import ArticleBySlugView

urlpatterns = [
    path('upload-image/', ArticleImageUploadView.as_view(), name='article_image_upload'),
    path('categories/', CategoryListView.as_view(), name='categories_list'),
    path('tags/', TagListView.as_view(), name='tags_list'),
    path('by-slug/<str:slug>/', ArticleBySlugView.as_view(), name='article_by_slug'),
    path('generate/', ArticleGenerateContentView.as_view(), name='article_generate'),
    path('<uuid:pk>/', ArticleDetailView.as_view(), name='article_detail'),
    path('', ArticleListCreateView.as_view(), name='articles_list_create'),
    path('<uuid:pk>/like/', ArticleLikeView.as_view(), name='article_like'),
    path('<uuid:pk>/comment/', CommentCreateView.as_view(), name='comment_create'),
    path('comment/<uuid:pk>/like/', CommentLikeView.as_view(), name='comment_like'),
    path('comment/<uuid:pk>/reply/', CommentReplyView.as_view(), name='comment_reply'),
    path('comment/<uuid:pk>/delete/', CommentDeleteView.as_view(), name='comment_delete'),
]
