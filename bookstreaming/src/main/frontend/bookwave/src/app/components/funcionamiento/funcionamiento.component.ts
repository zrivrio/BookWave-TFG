import { Component, Input } from '@angular/core';
import { Book } from '../../models/Book';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';
import { RecommendationsService } from '../../service/recommendations.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-funcionamiento',
  imports: [CommonModule],
  templateUrl: './funcionamiento.component.html',
  styleUrl: './funcionamiento.component.css'
})
export class FuncionamientoComponent {
  recommendedBooks: Book[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private recommendationsService: RecommendationsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.isLoading = true;
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      // Load random books for non-logged-in users
      this.recommendationsService.getRandomBooks().subscribe({
        next: (books) => {
          this.recommendedBooks = books;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los libros';
          this.isLoading = false;
        }
      });
    } else {
      // Load personalized recommendations for logged-in users
      this.recommendationsService.getRecommendedBooks(currentUser.id).subscribe({
        next: (books) => {
          this.recommendedBooks = books;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los libros recomendados';
          this.isLoading = false;
        }
      });
    }
  }
}
