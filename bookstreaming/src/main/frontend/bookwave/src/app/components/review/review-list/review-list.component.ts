import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../../models/Review';
import { ReviewService } from '../../../service/review.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, DatePipe], 
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input({ required: true }) bookId!: number;
  reviews: Review[] = [];
  loading = true;
  error: string | null = null;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByBook(this.bookId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las reseñas';
        this.loading = false;
        console.error(err);
      }
    });
  }
}