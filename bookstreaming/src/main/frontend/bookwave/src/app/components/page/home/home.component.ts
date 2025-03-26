import { Component, OnInit } from '@angular/core';
import { NewBookComponent } from "../../home/new-book/new-book.component";
import { ContinueReadingComponent } from "../../home/continue-reading/continue-reading.component";
import { RecommendedBooksComponent } from "../../home/recommended-books/recommended-books.component";
import { CommonModule } from '@angular/common';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/Book';
import { AuthService } from '../../../service/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ CommonModule,
    RouterModule,
    NewBookComponent,
    ContinueReadingComponent,
    RecommendedBooksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  continueReadingBooks: Book[] = [];
  featuredBook: Book | null = null;
  recommendedBooks: Book[] = [];
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadBooks();
    }
  }

  private loadBooks(): void {
    this.isLoading = true;
    this.error = '';
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.error = 'Usuario no encontrado';
      this.isLoading = false;
      return;
    }

    // Get books in progress
    this.bookService.getBooksInProgress(currentUser.id).subscribe({
      next: (books) => {
        this.continueReadingBooks = books.slice(0, 3);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
      }
    });

    // Get recommended books
    this.bookService.getRecommendedBooks(currentUser.id).subscribe(
      books => {
        this.recommendedBooks = books.slice(0, 4);
        if (books.length > 0) {
          this.featuredBook = books[0];
        }
      }
    );
  }
}
