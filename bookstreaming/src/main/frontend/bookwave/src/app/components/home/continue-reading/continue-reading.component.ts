import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-continue-reading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent implements OnInit {
  books: Book[] = [];
  isLoading: boolean = false;
  error: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.loadBooksInProgress();
    }
  }

  private loadBooksInProgress(): void {
    this.isLoading = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.error = 'Usuario no encontrado';
      this.isLoading = false;
      return;
    }

    this.bookService.getBooksInProgress(currentUser.id).subscribe({
      next: (books) => {
        this.books = books.slice(0, 3);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
      }
    });
  }

  getProgressPercentage(book: Book): number {
    if (book && book.readingProgress) {
      return book.readingProgress.percentageRead;
    }
    return 0;
  }
}