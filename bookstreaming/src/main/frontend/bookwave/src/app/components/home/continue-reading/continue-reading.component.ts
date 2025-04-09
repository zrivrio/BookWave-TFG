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

    const progress = this.getUserReadingProgress(book);
    const newPercentage = this.currentProgress[book.id];
    
    this.isLoading = true;

    if (progress) {
        // Actualizar progreso existente
        progress.percentageRead = newPercentage;
        if (book.totalPages) {
            progress.currentPage = Math.round((newPercentage * book.totalPages) / 100);
        }
        
        this.readingProgressService.updateReadingProgress(progress).subscribe({
            next: (updatedProgress) => {
                // Actualizar el progreso en el array existente
                const index = book.readingProgresses!.findIndex(p => p.id === updatedProgress.id);
                if (index >= 0) {
                    book.readingProgresses![index] = updatedProgress;
                }
                this.currentProgress[book.id] = updatedProgress.percentageRead;
                this.handleUpdateSuccess(book);
            },
            error: (err) => this.handleUpdateError()
        });
    } else {
        // Crear nuevo progreso
        const newProgress: Omit<ReadingProgress, 'id'> = {
            user: { id: currentUser.id },
            book: { id: book.id, totalPages: book.totalPages },
            currentPage: Math.round((newPercentage * (book.totalPages || 0)) / 100),
            percentageRead: newPercentage
        };
        
        this.readingProgressService.createReadingProgress(newProgress).subscribe({
            next: (createdProgress) => {
                if (!book.readingProgresses) book.readingProgresses = [];
                book.readingProgresses.push(createdProgress);
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