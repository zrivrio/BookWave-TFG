import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../../models/Review';
import { ReviewService } from '../../../service/review.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, DatePipe], 
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input({ required: true }) bookId!: number;
  @Input() reviews: Review[] = [];
  @Input() loading: boolean = false;
  error: string | null = null;
  users: { [key: number]: User } = {}; // Add this to store user data

  constructor(private reviewService: ReviewService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByBook(this.bookId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        // Load user data for each review
        this.reviews.forEach(review => {
          if (review.userid) { // Add this check
            this.userService.getUserById(review.userid).subscribe({
              next: (user) => {
                if (user) { // Add this check
                  this.users[review.userid] = user;
                }
              },
              error: (err) => {
                console.error(`Error loading user data for review ${review.id}:`, err);
              }
            });
          }
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las reseñas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getUserForReview(userId: number): User | null {
    return this.users[userId] || null;
  }
}