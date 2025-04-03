import csv
from django.core.management.base import BaseCommand
from importcsv.models import Book  # Replace 'importcsv' with your app name


class Command(BaseCommand):
    help = 'Load books data from CSV file'

    def handle(self, *args, **kwargs):
        file_path = 'Books_Data_300_Filtered.csv'  # Adjust path

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            Book.objects.all().delete()  # Optional: clear existing data
            for row in reader:
                Book.objects.create(
                    accession_no=row['AccessionNo'],
                    department=row['Department'],
                    title=row['Title'],
                    author=row['Author'],
                    isbn=row['ISBN']
                )
        self.stdout.write(self.style.SUCCESS('Books loaded successfully!'))
