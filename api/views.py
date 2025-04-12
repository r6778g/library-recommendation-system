
from django.contrib.auth.hashers import make_password, check_password
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import traceback
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from importcsv.models import Book
from .serializers import BookSerializer
from rest_framework import viewsets
from .models import Review  # Make sure you import the model
from .serializers import ReviewSerializer 
from rest_framework.views import APIView 
from rest_framework.response import Response
from .recommendation import get_recommendations
from .models import BorrowRecord
from .serializers import BorrowSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
api_view(['POST'])
def borrow_book(request):
    user_id = request.data.get('user')
    book_id = request.data.get('book')

    # do stuff with user_id and book_id

    return Response({"message": "Book borrowed"}, status=201)

def perform_create(self, serializer):
    user = serializer.validated_data['user']
    book = serializer.validated_data['book']
    if Borrow.objects.filter(user=user, book=book).exists():
        raise serializers.ValidationError("You have already borrowed this book.")
    serializer.save()




class BookViewSet(viewsets.ModelViewSet):  # ✅ Ensure this class exists
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
class ReviewViewSet(viewsets.ModelViewSet):  # ✅ Define ReviewViewSet
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
class ReviewByBookView(APIView):
    def get(self, request, book_id):
        try:
            reviews = Review.objects.filter(book__id=book_id)  # ✅ Filter reviews by book
            if not reviews.exists():
                return Response({"message": "No reviews found"}, status=404)
            
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

@api_view(['POST'])
def signup(request):
    data = request.data
    print("Received Data:", data)  

    required_fields = ['username', 'email', 'password', 'phone', 'department']
    if not all(key in data for key in required_fields):
        return Response({"error": "Missing required fields"}, status=400)

    if User.objects.filter(email=data['email']).exists():
        return Response({"error": "Email already exists"}, status=400)

    try:
        user = User.objects.create(
            name=data['username'],
            email=data['email'],
            password=make_password(data['password']),
            phone=data['phone'],
            department=data['department']
        )

        serializer = UserSerializer(user)
        return Response({"message": "User created successfully!", "user": serializer.data}, status=201)

    except Exception as e:
        print("Signup Error:", str(e))  
        traceback.print_exc()  # 🟢 Add this to see detailed backend error!
        return Response({"error": str(e)}, status=400)
@api_view(['POST'])
def login(request):
    data = request.data
    print("Login Request Data:", data)

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print("❌ Missing email or password")
        return Response({"error": "Email and password are required"}, status=400)

    try:
        user = User.objects.get(email=email)
        print("✅ User found:", user.email)
        print("👉 Provided password:", password)
        print("👉 Stored hash:", user.password)

        if check_password(password, user.password):
            print("✅ Password matched")
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                "message": "Login successful",
                "user": serializer.data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=200)
        else:
            print("❌ Password mismatch")
            return Response({"error": "Invalid credentials"}, status=401)

    except User.DoesNotExist:
        print("❌ User with email not found:", email)
        return Response({"error": "Invalid credentials"}, status=401)

    except Exception as e:
        print("🔥 Unexpected Error:", str(e))
        return Response({"error": "An error occurred during login"}, status=400)


@api_view(['GET'])
def book_list(request):
    books = Book.objects.all()

    # Search
    search_query = request.GET.get('search', '')
    if search_query:
        books = books.filter(title__icontains=search_query) | books.filter(author__icontains=search_query)

    # Filter by Department
    department = request.GET.get('department', '')
    if department:
        books = books.filter(department__iexact=department)

    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


class RecommendedBooksView(APIView):
    def get(self, request):
        # logic to filter recommended books
        return Response(data)

class RandomBooksView(APIView):
    def get(self, request):
        books = Book.objects.order_by('?')[:15]
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def recommend_books(request):
    title = request.GET.get('book')
    if not title:
        return Response({'error': 'Missing book title'}, status=400)

    results = get_recommendations(title)
    return Response({'recommendations': results})

@api_view(['GET'])
def get_profile(request):
    user = request.user
    return Response({
        "username": "mohit",
        "email": "mohitpaladiya150@gmail.com",
    })