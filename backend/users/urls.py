from django.urls import path
from .views import RegisterView, MeView, UserDetailView, CustomTokenObtainPairView, upload_profile_image
from .token_refresh_view import CustomTokenRefreshView
from .password_reset import forgot_password, reset_password
from . import views_stats

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('upload-image/', upload_profile_image, name='upload_profile_image'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('reset-password/', reset_password, name='reset_password'),
    path('<str:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('<str:user_id>/stats/', views_stats.user_stats, name='user-stats'),
    path('<str:user_id>/activity/', views_stats.user_activity, name='user-activity'),
]
