import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Book } from '../../../../models/Book';
import { BookService } from '../../../../service/book.service';
import { CategoryService } from '../../../../service/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddToReadingListComponent } from '../../add-to-reading-list/add-to-reading-list.component';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, RouterModule, AddToReadingListComponent],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent implements OnChanges, OnDestroy {
  @Input() selectedCategoryId: number | 'all' = 'all';
  @Input() searchTerm: string = '';
  books: Book[] = [];
  loading = false;
  private subscriptions = new Subscription();

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
    
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();

    if (this.searchTerm) {
      const sub = this.bookService.getBooksBySearch(this.searchTerm).subscribe({
        next: (books) => {
          this.books = books;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching books:', error);
          this.loading = false;
        }
      });
      this.subscriptions.add(sub);
      return;
    }

    if (this.selectedCategoryId === 'all') {
      const sub = this.bookService.getBooks().subscribe({
        next: (books) => {
          this.books = books;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading books:', error);
          this.loading = false;
        }
      });
      this.subscriptions.add(sub);
    } else {
      const sub = this.categoryService.getBooksByCategory(this.selectedCategoryId as number).subscribe({
        next: (books) => {
          this.books = books;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading books by category:', error);
          this.loading = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}