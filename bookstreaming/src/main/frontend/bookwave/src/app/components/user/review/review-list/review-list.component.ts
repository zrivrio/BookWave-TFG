import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../../../models/Review';
import { ReviewService } from '../../../../service/review.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../models/User';
import { Role } from '../../../../models/Role'; 
import { SubscriptionType } from '../../../../models/SubscriptionType';

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
    this.loadReviews();
  }

  refreshReviews(newReview?: Review): void {
    this.loading = true;
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

  loadReviews(): void {
    this.loading = true;
    this.refreshReviews();
  }
}