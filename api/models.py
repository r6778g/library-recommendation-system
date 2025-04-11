from django.db import models
from importcsv.models import Book
from django.contrib.auth.models import User

class BorrowRecord(models.Model):
    borrow_id = models.CharField(max_length=100, unique=True)
    book = models.ForeignKey('importcsv.Book', on_delete=models.CASCADE,  related_name="borrow_records")
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.borrow_id} - {self.user} borrowed {self.book}"


class User(models.Model):
    DEPARTMENT_CHOICES = [
        ('Department of Business', 'Department of Business'),
        ('Department of Computer Science', 'Department of Computer Science'),
        ('Department of Biology', 'Department of Biology'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=12, unique=True)
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name
    



class Review(models.Model):
    book = models.ForeignKey('importcsv.Book', on_delete=models.CASCADE, related_name="reviews")  # ✅ Reference Book from importcsv app
  
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.book.title} - {self.rating}⭐"