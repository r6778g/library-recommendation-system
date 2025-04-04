from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReviewViewSet, ReviewByBookView, signup, login

# Initialize DRF router
router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('reviews/book/<int:book_id>/', ReviewByBookView.as_view(), name='reviews-by-book'),
    path('', include(router.urls)),  # Registers books & reviews endpoints
]
