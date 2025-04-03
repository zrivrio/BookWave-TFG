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
  @Input() reviews: Review[] = []; // Especifica el tipo como Review[]
  @Input() loading: boolean = false;
  error: string | null = null;
  user: User = {} as User;

  constructor(private reviewService: ReviewService, private userService: UserService) {
    this.user = userService.getCurrentUser()!;
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByBook(this.bookId).subscribe({
      next: (reviews) => {
        console.log('Reseñas cargadas:', reviews); // Agrega este log para depuración
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