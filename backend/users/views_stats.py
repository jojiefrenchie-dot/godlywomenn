from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from articles.models import Article, ArticleView
from prayers.models import Prayer

from django.db.models import Count, DateField
from django.db.models.functions import TruncDate

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request, user_id):
    """Get user statistics including articles read and days active."""
    # Ensure the user can only access their own stats
    if str(request.user.id) != user_id:
        return Response({"error": "Unauthorized"}, status=403)

    # Calculate articles read (unique article views by the user)
    articles_read = ArticleView.objects.filter(user_id=user_id).values('article').distinct().count()

    # Calculate prayers posted
    prayers_posted = Prayer.objects.filter(author_id=user_id).count()

    # Calculate unique days where the user had any activity
    # Create a subquery for each model's dates
    article_dates = Article.objects.filter(author_id=user_id).values_list(
        TruncDate('created_at'), flat=True
    )
    
    view_dates = ArticleView.objects.filter(user_id=user_id).values_list(
        TruncDate('created_at'), flat=True
    )
    
    prayer_dates = Prayer.objects.filter(author_id=user_id).values_list(
        TruncDate('created_at'), flat=True
    )
    
    # Combine all dates using Python sets for uniqueness
    all_dates = set(article_dates) | set(view_dates) | set(prayer_dates)
    days_active = len(all_dates)    # If user has no activity yet, set days_active to 1 (today)
    if days_active == 0:
        days_active = 1

    return Response({
        'articlesRead': articles_read,
        'prayersPosted': prayers_posted,
        'daysActive': days_active
    })

from datetime import datetime
from django.utils.timezone import make_aware

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_activity(request, user_id):
    """Get user's recent activity."""
    # Ensure the user can only access their own activity
    if str(request.user.id) != user_id:
        return Response({"error": "Unauthorized"}, status=403)

    # Get last 7 days of activity
    last_week = timezone.now() - timedelta(days=7)
    
    # Combine recent articles views and posts
    activities = []

    # Add article views with proper date formatting
    article_views = ArticleView.objects.filter(
        user_id=user_id,
        created_at__gte=last_week
    ).select_related('article').order_by('-created_at')[:5]
    
    for view in article_views:
        # Format the date in a user-friendly way
        date_str = view.created_at.strftime('%B %d, %Y at %I:%M %p')
        activities.append({
            'type': 'Read article',
            'title': view.article.title,
            'date': date_str,
            'timestamp': view.created_at.isoformat()  # Keep the ISO format for sorting
        })

    # Add authored articles
    authored_articles = Article.objects.filter(
        author_id=user_id,
        created_at__gte=last_week
    ).order_by('-created_at')[:5]
    
    for article in authored_articles:
        date_str = article.created_at.strftime('%B %d, %Y at %I:%M %p')
        activities.append({
            'type': 'Posted article',
            'title': article.title,
            'date': date_str,
            'timestamp': article.created_at.isoformat()  # Keep the ISO format for sorting
        })

    # Add prayers
    prayers = Prayer.objects.filter(
        author_id=user_id,
        created_at__gte=last_week
    ).order_by('-created_at')[:5]
    
    for prayer in prayers:
        date_str = prayer.created_at.strftime('%B %d, %Y at %I:%M %p')
        activities.append({
            'type': 'Posted prayer',
            'title': prayer.title,
            'date': date_str,
            'timestamp': prayer.created_at.isoformat()  # Keep the ISO format for sorting
        })

    # Sort all activities by timestamp and take the 5 most recent
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    activities = activities[:5]

    # Remove timestamp from final output
    for activity in activities:
        del activity['timestamp']

    return Response(activities)