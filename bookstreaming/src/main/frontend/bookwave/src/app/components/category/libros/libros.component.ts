import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Book } from '../../../models/Book';
import { BookService } from '../../../service/book.service';
import { CategoryService } from '../../../service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-libros',
  imports: [CommonModule],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent implements OnChanges {
  @Input() selectedCategoryId: number | 'all' = 'all';
  books: Book[] = [];
  loading = false;

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId']) {
      this.loadBooks();
    }
  }

  loadBooks(): void {
    this.loading = true;
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

  onSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.loadBooks();
      return;
    }

    this.loading = true;
    this.bookService.getBooksBySearch(searchTerm).subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching books:', error);
        this.loading = false;
      }
    });
  }
}
