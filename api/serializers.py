from rest_framework import serializers
from .models import User
from importcsv.models import Book
from .models import Review  # Make sure to import the Review model
from django.contrib import admin
admin.site.site_header = "📚 Library Recommendation Admin"
admin.site.site_title = "Library Recommender"
admin.site.index_title = "Welcome to the Library Recommendation Dashboard"
from .models import BorrowRecord

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowRecord
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'user', 'rating', 'comment', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'department', 'created_at']

    def create(self, validated_data):
        # Hash password before saving
        user = User.objects.create(**validated_data)
        return user


class BookSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return sum([review.rating for review in reviews]) / reviews.count()
        return 0