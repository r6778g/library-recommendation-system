from django.db import models

class Book(models.Model):
    accession_no = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    title = models.TextField()
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=50) 

    def __str__(self):
        return self.title
# Create your models here.
