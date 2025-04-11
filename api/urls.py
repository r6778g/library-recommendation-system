from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReviewViewSet, ReviewByBookView, signup, login
from .views import RecommendedBooksView, RandomBooksView
from .views import recommend_books
from .views import get_profile
from .views import BorrowRecord


# Initialize DRF router
router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('reviews/book/<int:book_id>/', ReviewByBookView.as_view(), name='reviews-by-book'),
    path('recommended-books/', RecommendedBooksView.as_view(), name='recommended-books'),
    path('random-books/', RandomBooksView.as_view(), name='random-books'),
    path('recommend/', recommend_books, name='recommend_books'),
    path('profile/', get_profile, name='get_profile'),
    path('borrow/', BorrowRecord),
    path('', include(router.urls)),  # Registers books & reviews endpoints
]