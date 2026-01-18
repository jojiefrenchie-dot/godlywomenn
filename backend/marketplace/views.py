from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import models, transaction
from .models import Listing
from .serializers import ListingSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only to owner - compare by ID to be safe
        return obj.owner.id == request.user.id if request.user else False


class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save(owner=self.request.user)
                print(f"✓ Listing created: {serializer.data.get('id')}")
        except Exception as e:
            print(f"✗ Error creating listing: {str(e)}")
            import logging
            logging.error(f"Listing creation error: {str(e)}", exc_info=True)
            raise

    def get_queryset(self):
        queryset = Listing.objects.all()

        # Handle search filtering
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )

        return queryset


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    
    def get_permissions(self):
        # Allow reads for anyone
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        # For writes, user must be authenticated AND be the owner
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
    
    def update(self, request, *args, **kwargs):
        """Override update to handle image clearing"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Check if trying to clear image (empty string value)
        if 'image' in request.data:
            image_value = request.data.get('image')
            if image_value == '' or image_value is None:
                # Clear the image
                if instance.image:
                    instance.image.delete()
                instance.image = None
                instance.save()
                # Remove from data so serializer doesn't process it
                request.data._mutable = True
                del request.data['image']
                request.data._mutable = False
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)