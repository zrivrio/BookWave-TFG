import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../models/Review';
import { ReviewService } from '../../../service/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-reviews.component.html',
  styleUrl: './control-reviews.component.css'
})
export class ControlReviewsComponent implements OnInit {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm = '';
  ratingFilter = '';
  pageSize = 10;
  currentPage = 1;

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.filteredReviews = [...reviews];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las reseñas';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  filterReviews(): void {
    let filtered = [...this.reviews];

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(review =>
        review.book.title.toLowerCase().includes(term) ||
        review.user.username.toLowerCase().includes(term) ||
        review.comment.toLowerCase().includes(term)
      );
    }

    // Filtrar por rating
    if (this.ratingFilter) {
      filtered = filtered.filter(review => 
        review.rating === parseInt(this.ratingFilter)
      );
    }

    this.filteredReviews = filtered;
  }

  deleteReview(id: number | undefined): void {
    if (id === undefined) {
      this.error = 'Error: ID de reseña no válido';
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== id);
          this.filterReviews();
          this.error = null;
        },
        error: (error) => {
          this.error = 'Error al eliminar la reseña';
          console.error(error);
        }
      });
    }
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
