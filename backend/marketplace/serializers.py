from rest_framework import serializers
from django.conf import settings
from .models import Listing


class OwnerSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    email = serializers.EmailField()
    username = serializers.CharField(source='get_full_name', read_only=True)


class ListingSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Listing
        fields = ['id', 'title', 'description', 'price', 'currency', 'type', 
                  'owner', 'image', 'created_at', 'updated_at', 'contact', 'countryCode']

    def to_representation(self, instance):
        """Override to return image path instead of URL"""
        ret = super().to_representation(instance)
        if instance.image:
            ret['image'] = f"/media/{instance.image.name}"
        else:
            ret['image'] = None
        return ret
