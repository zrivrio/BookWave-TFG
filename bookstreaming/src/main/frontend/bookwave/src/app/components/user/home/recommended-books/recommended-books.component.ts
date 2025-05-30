import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../models/Book';
import { RecommendationsService } from '../../../../service/recommendations.service';
import { AuthService } from '../../../../service/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../../../service/library.service';
import { User } from '../../../../models/User';

@Component({
  selector: 'app-recommended-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recommended-books.component.html',
  styleUrl: './recommended-books.component.css'
})
export class RecommendedBooksComponent implements OnInit, OnDestroy {
  recommendedBooks: Book[] = [];
  isLoading: boolean = false;
  error: string = '';
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  private subscriptions: Subscription[] = [];

  constructor(
    private recommendationsService: RecommendationsService,
    private authService: AuthService,
    private router: Router,
    private libraryService: LibraryService
  ) { }

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.loadBooks();
    }
  }

  private loadBooks(): void {
    this.isLoading = true;
    this.error = '';
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.loadDefaultRecommendedBooks();
    } else {
      this.checkUserReadingLists(currentUser);
    }
  }

  private loadDefaultRecommendedBooks(): void {
    const sub = this.recommendationsService.getRandomBooks().subscribe({
      next: (books) => {
        this.recommendedBooks = books;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Error al cargar los libros recomendados');
      }
    });
    this.subscriptions.push(sub);
  }

  private checkUserReadingLists(user: User): void {
    const sub = this.libraryService.getLists(user.id).subscribe({
      next: (lists) => {
        if (lists.length === 0 || this.userHasEmptyLists(lists)) {
          this.loadDefaultRecommendedBooks();
        } else {
          this.loadPersonalizedRecommendations(user.id);
        }
      },
      error: (err) => {
        this.handleError('Error al verificar las listas de lectura');
        this.loadDefaultRecommendedBooks();
      }
    });
    this.subscriptions.push(sub);
  }

  private userHasEmptyLists(lists: any[]): boolean {
    return lists.every(list => list.books.length === 0);
  }

  private loadPersonalizedRecommendations(userId: number): void {
    const sub = this.recommendationsService.getRecommendedBooks(userId).subscribe({
      next: (books) => {
        this.recommendedBooks = books;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Error al cargar recomendaciones personalizadas');
        this.loadDefaultRecommendedBooks();
      }
    });
    this.subscriptions.push(sub);
  }

  private handleError(errorMessage: string): void {
    this.error = errorMessage;
    this.isLoading = false;
    console.error(errorMessage);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }
}