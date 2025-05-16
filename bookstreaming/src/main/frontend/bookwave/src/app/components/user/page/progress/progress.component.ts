import { Component, Input, OnInit } from '@angular/core';
import { ReadingProgress } from '../../../../models/ReadinProgress';
import { ReadingProgressService } from '../../../../service/reading-progress.service';
import { Book } from '../../../../models/Book';
import { AuthService } from '../../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-progress',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent implements OnInit {
  @Input() books: Book[] = [];
  isLoading: boolean = false;
  readingProgresses: { [bookId: number]: ReadingProgress } = {};
  error: string = '';
  isLoggedIn: boolean = false;
  editingProgress: { [key: number]: boolean } = {};
  currentPages: { [key: number]: number } = {};

  constructor(
    private readingProgressService: ReadingProgressService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.loadBooksInProgress();
    }
  }

  ngOnChanges(): void {
    if (this.isLoggedIn && this.books.length > 0) {
      this.initializeProgress();
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

    this.readingProgressService.getBooksInProgress(currentUser.id).subscribe({
      next: (books) => {
        this.books = books;
        this.loadAllReadingProgresses(currentUser.id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
      }
    });
  }

  private loadAllReadingProgresses(userId: number): void {
    this.books.forEach(book => {
      this.loadReadingProgress(userId, book.id);
    });
  }

  private loadReadingProgress(userId: number, bookId: number): void {
    this.readingProgressService.getReadingProgress(userId, bookId).subscribe({
      next: (progress) => {
        this.readingProgresses[bookId] = progress;
        this.currentPages[bookId] = progress.currentPage;
      },
      error: (err) => {
        this.readingProgresses[bookId] = {
          user: { id: userId, username: '' },  // Added username property
          book: { id: bookId, title: '' },     // Added title property
          currentPage: 0,
          percentageRead: 0
        };
        this.currentPages[bookId] = 0;
      }
    });
  }

  calculatePercentage(currentPage: number, totalPages: number): number {
    if (!totalPages || totalPages === 0) return 0;
    return Math.min(Math.round((currentPage / totalPages) * 100), 100);
  }

  updateProgress(book: Book): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const currentPage = this.currentPages[book.id] || 0;
    const totalPages = book.totalPages || 1;
    const percentageRead = Math.min(Math.round((currentPage / totalPages) * 100), 100);

    this.isLoading = true;

    const progressData: Partial<ReadingProgress> = {
      user: { id: currentUser.id, username: currentUser.username },
      book: { id: book.id, title: book.title },                  
      currentPage: currentPage,
      percentageRead: percentageRead
    };

    const existingProgress = this.readingProgresses[book.id];
    const request$ = existingProgress?.id
      ? this.readingProgressService.updateReadingProgress({
        ...existingProgress,
        ...progressData
      })
      : this.readingProgressService.createReadingProgress(progressData as ReadingProgress);

    request$.subscribe({
      next: (savedProgress) => {
        this.readingProgresses[book.id] = savedProgress;
        this.currentPages[book.id] = savedProgress.currentPage;
        this.handleUpdateSuccess(book);
      },
      error: (err) => this.handleUpdateError()
    });
  }

  private initializeProgress(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.books.forEach(book => {
      this.loadReadingProgress(currentUser.id, book.id);
    });
  }

  getProgressPercentage(book: Book): number {
    const progress = this.readingProgresses[book.id];
    return progress ? progress.percentageRead : 0;
  }

  toggleEditMode(bookId: number): void {
    this.editingProgress[bookId] = !this.editingProgress[bookId];
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

  deleteProgress(book: Book): void {
    const progress = this.readingProgresses[book.id];
    if (!progress?.id) return;

    this.isLoading = true;
    this.readingProgressService.deleteReadingProgress(progress.id).subscribe({
      next: () => {
        this.books = this.books.filter(b => b.id !== book.id);
        delete this.readingProgresses[book.id];
        delete this.currentPages[book.id];
        delete this.editingProgress[book.id];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el progreso';
        this.isLoading = false;
      }
    });
  }
}