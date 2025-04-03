import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Book } from '../../../models/Book';
import { BookService } from '../../../service/book.service';
import { CategoryService } from '../../../service/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent implements OnChanges {
  @Input() selectedCategoryId: number | 'all' = 'all';
  @Input() searchTerm: string = '';
  books: Book[] = [];
  loading = false;

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId'] || changes['searchTerm']) {
      this.loadBooks();
    }
  }

  loadBooks(): void {
    this.loading = true;

    if (this.searchTerm) {
      this.bookService.getBooksBySearch(this.searchTerm).subscribe({
        next: (books) => {
          this.books = books;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching books:', error);
          this.loading = false;
        }
      });
      return;
    }

    if (this.selectedCategoryId === 'all') {
      this.bookService.getBooks().subscribe({
        next: (books) => {
          this.books = books;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading books:', error);
          this.loading = false;
        }
      });
    } else {
      this.categoryService.getBooksByCategory(this.selectedCategoryId as number).subscribe({
        next: (books) => {
          this.books = books;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading books by category:', error);
          this.loading = false;
        }
      });
    }
  }
}
