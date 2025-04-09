import { Component, Input } from '@angular/core';
import { ReadingProgress } from '../../../models/ReadinProgress';
import { ReadingProgressService } from '../../../service/reading-progress.service';
import { Book } from '../../../models/Book';
import { AuthService } from '../../../service/auth.service';
import { BookService } from '../../../service/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-progress',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent {
  @Input() books: Book[] = [];
  isLoading: boolean = false;
  readingProgresses: {[bookId: number]: ReadingProgress} = {}; // Almacena los progresos por libro
  error: string = '';
  isLoggedIn: boolean = false;
  editingProgress: { [key: number]: boolean } = {};
  currentProgress: { [key: number]: number } = {};

  constructor(
    private readingProgressService: ReadingProgressService,
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn && this.books.length === 0) {
      this.loadBooksInProgress();
    } else if (this.books.length > 0) {
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

    this.bookService.getBooksInProgress(currentUser.id).subscribe({
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
        this.currentProgress[bookId] = progress.percentageRead;
      },
      error: (err) => {
        // Si no existe progreso, crea uno por defecto
        this.readingProgresses[bookId] = {
          user: { id: userId },
          book: { id: bookId },
          currentPage: 0,
          percentageRead: 0
        };
        this.currentProgress[bookId] = 0;
      }
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

  updateProgress(book: Book): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const progress = this.readingProgresses[book.id];
    const newPercentage = this.currentProgress[book.id];
    
    this.isLoading = true;

    const updateData: Partial<ReadingProgress> = {
      user: { id: currentUser.id },
      book: { id: book.id },
      currentPage: Math.round((newPercentage * (book.totalPages || 0)) / 100),
      percentageRead: newPercentage
    };

    if (progress && progress.id) {
      // Actualizar progreso existente
      this.readingProgressService.updateReadingProgress({
        ...progress,
        ...updateData
      }).subscribe({
        next: (updatedProgress) => {
          this.readingProgresses[book.id] = updatedProgress;
          this.currentProgress[book.id] = updatedProgress.percentageRead;
          this.handleUpdateSuccess(book);
        },
        error: (err) => this.handleUpdateError()
      });
    } else {
      // Crear nuevo progreso
      this.readingProgressService.createReadingProgress({
        ...updateData,
        id: undefined
      } as ReadingProgress).subscribe({
        next: (createdProgress) => {
          this.readingProgresses[book.id] = createdProgress;
          this.currentProgress[book.id] = createdProgress.percentageRead;
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