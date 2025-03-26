import { Component, OnInit } from '@angular/core';
import { NewBookComponent } from "../../home/new-book/new-book.component";
import { ContinueReadingComponent } from "../../home/continue-reading/continue-reading.component";
import { RecommendedBooksComponent } from "../../home/recommended-books/recommended-books.component";
import { CommonModule } from '@angular/common';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/Book';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NewBookComponent, ContinueReadingComponent, RecommendedBooksComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit {
  continueReadingBooks: Book[] = [];
  featuredBook: Book | null = null;
  recommendedBooks: Book[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.loadBooks();
    }
  }

  private loadBooks(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      return;
    }
    
    // Get books in progress
    this.bookService.getBooksInProgress(currentUser.id).subscribe(
      books => {
        this.continueReadingBooks = books.slice(0, 3);
      }
    );

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
