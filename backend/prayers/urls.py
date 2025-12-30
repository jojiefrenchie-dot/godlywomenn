from django.urls import path
from . import views

urlpatterns = [
    path('', views.PrayerListCreateView.as_view(), name='prayer-list'),
    path('<uuid:pk>/', views.PrayerDetailView.as_view(), name='prayer-detail'),
    path('<uuid:prayer_id>/respond/', views.PrayerResponseCreateView.as_view(), name='prayer-respond'),
    path('<uuid:prayer_id>/support/', views.prayer_support, name='prayer-support'),
    path('responses/<uuid:response_id>/like/', views.response_like, name='response-like'),
]