import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { AuthService } from '../../../service/auth.service';
import { ReadingProgressService } from '../../../service/reading-progress.service';
import { ReadingProgress } from '../../../models/ReadinProgress';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

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
  readingProgresses: { [bookId: number]: ReadingProgress } = {};

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

    this.readingProgressService.getBooksInProgress(currentUser.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (books) => {
          this.books = books.slice(0, 3); // Only show first 3 books
          this.loadReadingProgresses(currentUser.id);
        },
        error: (err) => {
          this.error = 'Error al cargar los libros';
        }
      });
  }

  private loadReadingProgresses(userId: number): void {
    this.books.forEach(book => {
      this.readingProgressService.getReadingProgress(userId, book.id)
        .subscribe({
          next: (progress) => {
            this.readingProgresses[book.id] = progress;
            this.currentProgress[book.id] = progress.percentageRead;
          },
          error: (err) => {
            // Si no existe progreso, inicializar con 0%
            this.readingProgresses[book.id] = {
              user: { id: userId },
              book: { id: book.id },
              currentPage: 0,
              percentageRead: 0
            };
            this.currentProgress[book.id] = 0;
          }
        });
    });
  }

  getProgressPercentage(book: Book): number {
    return this.readingProgresses[book.id]?.percentageRead || 0;
  }

  toggleEditMode(bookId: number): void {
    this.editingProgress[bookId] = !this.editingProgress[bookId];
  }

  updateProgress(book: Book): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newPercentage = this.currentProgress[book.id];
    const existingProgress = this.readingProgresses[book.id];
    
    this.isLoading = true;

    const progressData: Partial<ReadingProgress> = {
      user: { id: currentUser.id },
      book: { id: book.id },
      currentPage: Math.round((newPercentage * (book.totalPages || 0)) / 100),
      percentageRead: newPercentage
    };

    const request$ = existingProgress?.id 
      ? this.readingProgressService.updateReadingProgress({ 
          ...existingProgress, 
          ...progressData 
        })
      : this.readingProgressService.createReadingProgress(progressData as ReadingProgress);

    request$.subscribe({
      next: (savedProgress) => {
        this.readingProgresses[book.id] = savedProgress;
        this.currentProgress[book.id] = savedProgress.percentageRead;
        this.handleUpdateSuccess(book);
      },
      error: (err) => this.handleUpdateError()
    });
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