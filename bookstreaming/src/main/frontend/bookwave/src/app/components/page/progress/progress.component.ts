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
  error: string = '';
  isLoggedIn: boolean = false;
  editingProgress: { [key: number]: boolean } = {};
  currentProgress: { [key: number]: number } = {};

  constructor(
    private readingProgress: ReadingProgressService,
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
      const progress = this.getReadingProgress(book);
      this.currentProgress[book.id] = progress ? progress.percentageRead : 0;
    });
  }

  getReadingProgress(book: Book): ReadingProgress | null {
    if (!book.readingProgresses || book.readingProgresses.length === 0) return null;
    const currentUser = this.authService.currentUserValue;
    return book.readingProgresses.find(p => p.user.id === currentUser!.id) || null;
  }

  toggleEditMode(bookId: number): void {
    this.editingProgress[bookId] = !this.editingProgress[bookId];
  }

  updateProgress(book: Book): void {
    const progress = this.getReadingProgress(book);
    if (!progress) return;

    this.isLoading = true;
    progress.percentageRead = this.currentProgress[book.id];
    
    this.readingProgress.updateReadingProgress(progress).subscribe({
      next: () => {
        this.isLoading = false;
        this.editingProgress[book.id] = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar el progreso';
        this.isLoading = false;
      }
    });
    
    // Simulación hasta que implementes el servicio
    setTimeout(() => {
      this.isLoading = false;
      this.editingProgress[book.id] = false;
    }, 500);
  }

  getProgressPercentage(book: Book): number {
    const progress = this.getReadingProgress(book);
    return progress ? progress.percentageRead : 0;
  }

  getProgressColor(percentage: number): string {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  }
}
