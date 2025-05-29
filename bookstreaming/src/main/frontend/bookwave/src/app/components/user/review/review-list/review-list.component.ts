import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Review } from '../../../../models/Review';
import { ReviewService } from '../../../../service/review.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../models/User';
import { Role } from '../../../../models/Role'; 
import { SubscriptionType } from '../../../../models/SubscriptionType';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit, OnChanges {
  @Input() bookId!: number;
  @Input() reviews: Review[] = [];
  @Input() loading: boolean = false;
  error: string | null = null;
  user: User = {
    id: 0,
    username: 'Usuario anónimo',
    email: '',
    password: '',
    role: Role.User,
    subscriptionType: SubscriptionType.Free,
    reviews: [],
    readingLists: []
  };

  constructor(private reviewService: ReviewService, private userService: UserService) {
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  ngOnInit(): void {
    if (!this.reviews || this.reviews.length === 0) {
      this.loadReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && !changes['bookId'].firstChange) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.loading = true;
    this.error = null;
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

  addReview(newReview: Review): void {
    this.reviews = [newReview, ...this.reviews]; 
  }
}