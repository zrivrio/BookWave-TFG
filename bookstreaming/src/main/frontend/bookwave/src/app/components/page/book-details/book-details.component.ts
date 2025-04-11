import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/Book';
import { ReviewListComponent } from '../../review/review-list/review-list.component';
import { ReviewFormComponent } from '../../review/review-form/review-form.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/User';
import { ReadingProgressService } from '../../../service/reading-progress.service';
import { ReadingProgress } from '../../../models/ReadinProgress';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, ReviewFormComponent, ReviewListComponent, FormsModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | undefined;
  loading = true;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private userService: UserService,
    private readingProgressService: ReadingProgressService
  ) {}

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

  onReadNow(): void {
    if (!this.currentUser || !this.book) {
      console.warn('User or book not available');
      return;
    }

    const progress: ReadingProgress = {
      user: { id: this.currentUser.id } as User,
      book: { id: this.book.id } as Book,
      currentPage: 0,
      percentageRead: 0
    };

    this.readingProgressService.createReadingProgress(progress).subscribe({
      next: (savedProgress) => {
        console.log('Reading progress saved:', savedProgress);
        // Navigate to the progress page instead of the read page
        this.router.navigate(['/progress']);
      },
      error: (err) => {
        console.error('Error saving reading progress:', err);
        // You might want to show an error message to the user here
      }
    });
  }

  onReviewSubmitted(): void {
    this.loadBookDetails(); // Reload book details to update ratings
  }
}