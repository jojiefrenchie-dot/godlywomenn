from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Prayer, PrayerResponse, PrayerSupport, PrayerResponseLike
from .serializers import PrayerSerializer, PrayerResponseSerializer

class PrayerListCreateView(generics.ListCreateAPIView):
    serializer_class = PrayerSerializer
    
    def get_queryset(self):
        queryset = Prayer.objects.all()
        
        # Filter by author
        author_id = self.request.query_params.get('author', None)
        if author_id:
            queryset = queryset.filter(author_id=author_id)
            
        # Filter by prayer type
        prayer_type = self.request.query_params.get('type', None)
        if prayer_type:
            queryset = queryset.filter(prayer_type=prayer_type)
            
        # Only show public prayers for non-authors
        if not author_id or str(self.request.user.id) != author_id:
            queryset = queryset.filter(is_public=True)
            
        return queryset.order_by('-created_at')
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
        
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PrayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PrayerSerializer
    queryset = Prayer.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
        
    def perform_update(self, serializer):
        if self.request.user != serializer.instance.author:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own prayers.")
        serializer.save()
        
    def perform_destroy(self, instance):
        if self.request.user != instance.author:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own prayers.")
        instance.delete()

class PrayerResponseCreateView(generics.CreateAPIView):
    serializer_class = PrayerResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        prayer = get_object_or_404(Prayer, id=self.kwargs['prayer_id'])
        serializer.save(author=self.request.user, prayer=prayer)

@api_view(['POST', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def prayer_support(request, prayer_id):
    prayer = get_object_or_404(Prayer, id=prayer_id)
    
    if request.method == 'POST':
        support, created = PrayerSupport.objects.get_or_create(
            prayer=prayer,
            user=request.user
        )
        support_count = PrayerSupport.objects.filter(prayer=prayer).count()
        if created:
            return Response({
                'message': 'Prayer support added',
                'support_count': support_count
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Already supporting',
            'support_count': support_count
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'DELETE':
        support = PrayerSupport.objects.filter(prayer=prayer, user=request.user)
        if support.exists():
            support.delete()
        support_count = PrayerSupport.objects.filter(prayer=prayer).count()
        return Response({
            'message': 'Prayer support removed',
            'support_count': support_count
        }, status=status.HTTP_200_OK)

@api_view(['POST', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def response_like(request, response_id):
    response_obj = get_object_or_404(PrayerResponse, id=response_id)
    
    if request.method == 'POST':
        like, created = PrayerResponseLike.objects.get_or_create(
            response=response_obj,
            user=request.user
        )
        likes_count = PrayerResponseLike.objects.filter(response=response_obj).count()
        if created:
            return Response({
                'message': 'Response liked',
                'likes_count': likes_count
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Already liked',
            'likes_count': likes_count
        }, status=status.HTTP_200_OK)
        
    elif request.method == 'DELETE':
        like = PrayerResponseLike.objects.filter(response=response_obj, user=request.user)
        if like.exists():
            like.delete()
        likes_count = PrayerResponseLike.objects.filter(response=response_obj).count()
        return Response({
            'message': 'Response like removed',
            'likes_count': likes_count
        }, status=status.HTTP_200_OK)
