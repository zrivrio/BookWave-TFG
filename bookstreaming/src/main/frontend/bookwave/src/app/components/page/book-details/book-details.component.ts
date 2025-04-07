import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/book';
import { ReviewListComponent } from '../../review/review-list/review-list.component';
import { ReviewFormComponent } from '../../review/review-form/review-form.component';
import { FormsModule } from '@angular/forms'; // Añadir esto
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    ReviewFormComponent,
    ReviewListComponent,
    FormsModule // Añadir esto para ngModel
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  book: Book | undefined;
  loading = true;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadBookDetails();
    this.currentUser = this.userService.getCurrentUser();
  }

  loadBookDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.bookService.getBookById(+id).subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles del libro';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'ID de libro no proporcionado';
      this.loading = false;
    }
  }

  @ViewChild(ReviewListComponent) reviewList!: ReviewListComponent;

  onReviewSubmitted(): void {
      if (this.reviewList) {
          this.reviewList.loadReviews();
      }
  }
}