import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../../service/book.service';
import { Book } from '../../../../models/Book';
import { ReviewListComponent } from '../../review/review-list/review-list.component';
import { ReviewFormComponent } from '../../review/review-form/review-form.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../models/User';
import { ReadingProgressService } from '../../../../service/reading-progress.service';
import { ReadingProgress } from '../../../../models/ReadinProgress';
import { AddToReadingListComponent } from '../../add-to-reading-list/add-to-reading-list.component';
import { ReviewService } from '../../../../service/review.service';
import { Review } from '../../../../models/Review';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, ReviewFormComponent, ReviewListComponent, FormsModule, AddToReadingListComponent],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | undefined;
  loading = true;
  error: string | null = null;
  currentUser: User | null = null;
  averageRating: number = 0;
   reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private userService: UserService,
    private readingProgressService: ReadingProgressService,
    private reviewService: ReviewService
  ) { }

   ngOnInit(): void {
    this.loadBookDetails();
    this.currentUser = this.userService.getCurrentUser();
  }

  loadBookDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && !isNaN(Number(id))) {
      this.bookService.getBookById(Number(id)).subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
          this.loadAverageRating();
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles del libro';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'ID de libro no válido';
      this.loading = false;
    }
  }

  private loadAverageRating(): void {
    if (this.book?.id) {
      this.reviewService.getAverageRatingByBook(this.book.id).subscribe({
        next: (rating) => {
          this.averageRating = rating || 0;
        },
        error: (error) => {
          console.error('Error al cargar el rating:', error);
          this.averageRating = 0;
        }
      });
    }
  }

  onReadNow(): void {
    if (!this.currentUser || !this.book) {
      console.warn('User or book not available');
      return;
    }

    const progress: ReadingProgress = {
      user: { id: this.currentUser.id } as User,
      book: {
        id: this.book.id,
        title: this.book.title,
      },
      currentPage: 0,
      percentageRead: 0
    };

    this.readingProgressService.createReadingProgress(progress).subscribe({
      next: (savedProgress) => {
        console.log('Reading progress saved:', savedProgress);
        this.router.navigate(['/progress']);
      },
      error: (err) => {
        console.error('Error saving reading progress:', err);
      }
    });
  }

  onReviewSubmitted(): void {
    this.loadBookDetails();
  }
}