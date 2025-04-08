import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Review } from '../../../models/Review';
import { User } from '../../../models/User';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';
import { BookService } from '../../../service/book.service';
import { UserService } from '../../../service/user.service';

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
  usuario: User = {} as User;
  libro: Book = {} as Book;

  constructor(private bookService: BookService, private userService: UserService) {
    this.usuario = userService.getCurrentUser()!;
    bookService.getBookById(this.bookId).subscribe(
      book => {
        this.libro = book;
      },
    );
  }

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
  
    // Crear objeto simplificado para el backend
    const reviewToSend = {
      bookid: this.libro.id , // Solo enviar el ID del libro
      userid:this.usuario.id, // Solo enviar el ID del usuario
      rating: this.newReview.rating,
      comment: this.newReview.comment.trim()
    };
  
    this.reviewSubmitted.emit(reviewToSend);
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