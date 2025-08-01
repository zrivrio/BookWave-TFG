import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Review } from '../../../../models/Review';
import { User } from '../../../../models/User';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Book } from '../../../../models/Book';
import { BookService } from '../../../../service/book.service';
import { UserService } from '../../../../service/user.service';
import { ReviewService } from '../../../../service/review.service';
import { AuthService } from '../../../../service/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], 
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input({ required: true }) bookId!: number;
  @Input() bookTitle: string = '';
  @Input({ required: true }) currentUser!: User;
  @Output() reviewCreated = new EventEmitter<Review>();
  usuario: User = {} as User;
  libro: Book = {} as Book;
  readonly possibleRatings = [1, 2, 3, 4, 5] as const;
  newReview = {
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    comment: ''
  };
  error: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private bookService: BookService, 
    private userService: UserService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.usuario = this.userService.getCurrentUser()!;
      this.bookService.getBookById(this.bookId).subscribe(
        book => {
          this.libro = book;
        },
      );
    }
}
  
  toggleForm(): void {
    this.error = null;
  }

  setRating(rating: 1 | 2 | 3 | 4 | 5): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.newReview.comment || this.newReview.comment.trim().length < 10) {
        this.error = 'El comentario debe tener al menos 10 caracteres';
        return;
    }

    const reviewToSend: Review = {
        book: { 
            title: this.bookTitle,
            id: this.bookId,
        },
        user: { 
            id: this.currentUser.id,
            username: this.currentUser.username
        },
        rating: this.newReview.rating,
        comment: this.newReview.comment.trim()
    };

    this.reviewService.createReview(reviewToSend).subscribe({
        next: (savedReview) => {
            // Emite la reseña completa que viene del servidor
            this.reviewCreated.emit({
                ...savedReview,
                user: {  // Asegura que el usuario tenga los datos mínimos
                    id: this.currentUser.id,
                    username: this.currentUser.username
                }
            });
            this.resetForm();
        },
        error: (error) => {
            this.error = 'Error al guardar la reseña. Por favor, inténtalo de nuevo.';
            console.error('Error saving review:', error);
        }
    });
}

  private resetForm(): void {
    this.newReview = {
      rating: 5 as 1 | 2 | 3 | 4 | 5,
      comment: ''
    };
    this.error = null;
  }
}