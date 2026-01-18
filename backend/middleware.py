"""
Middleware for better error logging and handling
"""
import json
import logging
from django.http import JsonResponse

logger = logging.getLogger(__name__)


class ErrorLoggingMiddleware:
    """Log all errors in detail for debugging"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            # Log 5xx errors
            if response.status_code >= 500:
                logger.error(f'[ERROR] {request.method} {request.path} returned {response.status_code}')
                logger.error(f'Response: {response.content[:200]}')
            return response
        except Exception as e:
            logger.error(f'[CRITICAL ERROR] {request.method} {request.path}')
            logger.error(f'Exception: {str(e)}', exc_info=True)
            return JsonResponse(
                {'detail': 'Server error', 'error': str(e)},
                status=500
            )
