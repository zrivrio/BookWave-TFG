import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Review } from '../../../models/Review';
import { User } from '../../../models/User';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input({ required: true }) bookId!: number;
  @Input() bookTitle: string = '';
  @Input({ required: true }) currentUser!: User;
  @Output() reviewSubmitted = new EventEmitter<Review>();

  // Definimos los valores posibles para rating
  readonly possibleRatings = [1, 2, 3, 4, 5] as const;
  
  newReview = {
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    comment: ''
  };

  showForm = false;
  error: string | null = null;

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.error = null;
  }

  // Método seguro para establecer el rating
  setRating(rating: 1 | 2 | 3 | 4 | 5): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.newReview.comment || this.newReview.comment.trim().length < 10) {
      this.error = 'El comentario debe tener al menos 10 caracteres';
      return;
    }

    const review: Review = {
      id: 0,
      book: {
        id: this.bookId,
        title: this.bookTitle
      },
      user: {
        id: this.currentUser.id,
        username: this.currentUser.username,
        email: this.currentUser.email
      },
      rating: this.newReview.rating,
      comment: this.newReview.comment.trim()
    };

    this.reviewSubmitted.emit(review);
    this.resetForm();
  }

  private resetForm(): void {
    this.newReview = {
      rating: 5,
      comment: ''
    };
    this.showForm = false;
    this.error = null;
  }
}