import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Book } from '../../../models/Book';
import { RecommendationsService } from '../../../service/recommendations.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-recommended-books',
  imports: [CommonModule],
  templateUrl: './recommended-books.component.html',
  styleUrl: './recommended-books.component.css'
})
export class RecommendedBooksComponent {
  recommendedBooks: Book[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private recommendationsService: RecommendationsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecommendedBooks();
  }

  private loadRecommendedBooks(): void {
    this.isLoading = true;
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      this.error = 'Usuario no encontrado';
      this.isLoading = false;
      return;
    }

    this.recommendationsService.getRecommendedBooks(currentUser.id).subscribe({
      next: (books) => {
        this.recommendedBooks = books.slice(0, 4);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los libros recomendados';
        this.isLoading = false;
      }
    });
  }
}