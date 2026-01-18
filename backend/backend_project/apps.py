"""
App configuration with signal registration
"""
from django.apps import AppConfig

class BackendProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend_project'
    
    def ready(self):
        # Import signals
        try:
            import db_signals
        except ImportError:
            pass
