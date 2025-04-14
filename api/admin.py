# myapp/admin.py

from django.contrib import admin
from django.contrib.auth.models import User
from .models import Book
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import BorrowRecord  # Import the BorrowRecord model

# Define a model admin to customize how the Borrow Record appears in the admin panel
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrow_date', 'return_date')  # Columns to display in the list view
    list_filter = ('borrow_date', 'return_date')  # Add filters for easy searching
    search_fields = ('user__username', 'book__title')  # Allow search by user's username and book title
    date_hierarchy = 'borrow_date'  # Add date filtering by borrow date


admin.site.register(BorrowRecord, BorrowRecordAdmin)
admin.site.register(Book)
# First, unregister the default User admin
admin.site.unregister(User)

# Then re-register it with a custom class
@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'email', 'is_staff']