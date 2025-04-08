import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { AuthService } from '../../../service/auth.service';
import { ReadingProgressService } from '../../../service/reading-progress.service';
import { ReadingProgress } from '../../../models/ReadinProgress';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-continue-reading',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent implements OnInit {
  books: Book[] = [];
  isLoading: boolean = false;
  error: string = '';
  isLoggedIn: boolean = false;
  editingProgress: { [key: number]: boolean } = {};
  currentProgress: { [key: number]: number } = {};

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private readingProgressService: ReadingProgressService
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
        this.initializeProgress();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
      }
    });
  }

  private initializeProgress(): void {
    this.books.forEach(book => {
      const progress = this.getUserReadingProgress(book);
      this.currentProgress[book.id] = progress ? progress.percentageRead : 0;
    });
  }

  getUserReadingProgress(book: Book) {
    const currentUser = this.authService.currentUserValue;
    if (!book.readingProgresses || !currentUser) return null;
    return book.readingProgresses.find(p => p.user.id === currentUser.id);
  }

  getProgressPercentage(book: Book): number {
    const progress = this.getUserReadingProgress(book);
    return progress ? progress.percentageRead : 0;
  }

  toggleEditMode(bookId: number): void {
    this.editingProgress[bookId] = !this.editingProgress[bookId];
  }

  updateProgress(book: Book): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    let progress = this.getUserReadingProgress(book);
    
    this.isLoading = true;

    if (!progress) {
      // Crear nuevo progreso si no existe
      const newProgress: Omit<ReadingProgress, 'id'> = {
        user: { id: currentUser.id },
        book: { id: book.id, totalPages: book.totalPages },
        currentPage: 0,
        percentageRead: this.currentProgress[book.id]
      };
      
      this.readingProgressService.createReadingProgress(newProgress).subscribe({
        next: (createdProgress) => {
          if (!book.readingProgresses) book.readingProgresses = [];
          book.readingProgresses.push(createdProgress);
          this.handleUpdateSuccess(book);
        },
        error: (err) => this.handleUpdateError()
      });
    } else {
      // Actualizar progreso existente
      progress.percentageRead = this.currentProgress[book.id];
      if (book.totalPages) {
        progress.currentPage = Math.round((this.currentProgress[book.id] * book.totalPages) / 100);
      }
      
      this.readingProgressService.updateReadingProgress(progress).subscribe({
        next: (updatedProgress) => {
          const index = book.readingProgresses!.findIndex(p => p.id === updatedProgress.id);
          if (index >= 0) {
            book.readingProgresses![index] = updatedProgress;
          }
          this.handleUpdateSuccess(book);
        },
        error: (err) => this.handleUpdateError()
      });
    }
}

  private handleUpdateSuccess(book: Book): void {
    this.isLoading = false;
    this.editingProgress[book.id] = false;
  }

  private handleUpdateError(): void {
    this.error = 'Error al actualizar el progreso';
    this.isLoading = false;
  }

  getProgressColor(percentage: number): string {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  }
}