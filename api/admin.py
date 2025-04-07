# myapp/admin.py

from django.contrib import admin
from django.contrib.auth.models import User
from .models import Book
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

admin.site.register(Book)
# First, unregister the default User admin
admin.site.unregister(User)

# Then re-register it with a custom class
@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'email', 'is_staff']
