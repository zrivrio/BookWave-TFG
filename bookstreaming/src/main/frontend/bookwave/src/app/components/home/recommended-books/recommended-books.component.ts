import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

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

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({
      left: -300, // Adjust this value based on your card width + gap
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({
      left: 300, // Adjust this value based on your card width + gap
      behavior: 'smooth'
    });
  }
}