"""
Custom token refresh view that properly handles errors
"""
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
import json
import logging

logger = logging.getLogger(__name__)


class CustomTokenRefreshView(TokenRefreshView):
    """
    Override the default TokenRefreshView to:
    1. Handle database errors gracefully
    2. Provide better error messages
    3. Avoid token blacklist errors
    """
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token_str = request.data.get('refresh')
            
            if not refresh_token_str:
                logger.error('[TOKEN_REFRESH] No refresh token provided')
                return Response(
                    {'detail': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                # Validate and create new access token from refresh token
                refresh = RefreshToken(refresh_token_str)
                access_token = str(refresh.access_token)
                
                # Get the new refresh token (if rotating)
                new_refresh = str(refresh)
                
                logger.info('[TOKEN_REFRESH] ✓ Token refresh successful')
                
                return Response({
                    'access': access_token,
                    'refresh': new_refresh,
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.error(f'[TOKEN_REFRESH] Token validation failed: {str(e)}')
                return Response(
                    {'detail': f'Invalid refresh token: {str(e)}'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f'[TOKEN_REFRESH] Unexpected error: {str(e)}', exc_info=True)
            return Response(
                {'detail': 'Token refresh failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
