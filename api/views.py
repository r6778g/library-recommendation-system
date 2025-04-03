

from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import traceback
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from importcsv.models import Book
from .serializers import BookSerializer
from rest_framework import viewsets
from .models import Review  # Make sure you import the model
from .serializers import ReviewSerializer 
from rest_framework.views import APIView 


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
    print("Login attempt:", data.get('email'))  # ✅ Debug email

    # Check for required fields
    if not all(key in data for key in ['email', 'password']):
        return Response({"error": "Email and password are required"}, status=400)

    try:
        # Find user by email
        user = User.objects.get(email=data['email'])
        print("User found:", user.email)  # ✅ Debug

        # Verify password
        if check_password(data['password'], user.password):
            print("Password matched!")  # ✅ Debug
            refresh = RefreshToken.for_user(user)  # Generate token

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
            print("❌ Incorrect password!")  # Debugging
            return Response({"error": "Invalid credentials"}, status=401)

    except User.DoesNotExist:
        print("❌ User not found!")  # Debugging
        return Response({"error": "Invalid credentials"}, status=401)

    except Exception as e:
        print("Login Error:", str(e))
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

