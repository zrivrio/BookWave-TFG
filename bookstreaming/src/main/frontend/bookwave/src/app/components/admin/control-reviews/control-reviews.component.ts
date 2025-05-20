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
  selectedUsers: Set<number> = new Set();

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
    this.filteredReviews = this.reviews.filter(review => {
      const matchesSearch = !this.searchTerm || 
        review.book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRating = !this.ratingFilter || 
        review.rating === parseInt(this.ratingFilter);

      return matchesSearch && matchesRating;
    });
  }

  getUserReviews(user: any): Review[] {
    return this.filteredReviews.filter(review => review.user.id === user.id);
  }

  getUniqueUsers() {
    const uniqueUsers = new Map();
    this.filteredReviews.forEach(review => {
      if (!uniqueUsers.has(review.user.id)) {
        uniqueUsers.set(review.user.id, review.user);
      }
    });
    return Array.from(uniqueUsers.values());
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

  toggleUserReviews(userId: number): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  isUserExpanded(user: any): boolean {
    return this.selectedUsers.has(user.id);
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) return 'bg-[#E6F0F7] text-[#1965B3]'; 
    if (rating >= 3) return 'bg-[#F8F8F8] text-[#2A2A2A]'; 
    if (rating >= 2) return 'bg-[#EBB2C3] text-[#E893C5]'; 
    return 'bg-[#F5F5F5] text-[#999999]';                  
  }
}
