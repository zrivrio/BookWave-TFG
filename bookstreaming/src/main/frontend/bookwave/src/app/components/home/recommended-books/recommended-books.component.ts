import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Book } from '../../../models/Book';
import { RecommendationsService } from '../../../service/recommendations.service';
import { AuthService } from '../../../service/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recommended-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recommended-books.component.html',
  styleUrl: './recommended-books.component.css'
})
export class RecommendedBooksComponent implements OnInit, OnDestroy  {
  recommendedBooks: Book[] = [];
  isLoading: boolean = false;
  error: string = '';
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  private subscription: Subscription | null = null;

  constructor(
    private recommendationsService: RecommendationsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Only load books if we're on the home page
    if (this.router.url === '/') {
      this.loadBooks();
    }
  }

  private loadBooks(): void {
    this.isLoading = true;
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      // Only subscribe if we're on the home page
      if (this.router.url === '/') {
        this.subscription = this.recommendationsService.getRandomBooks().subscribe({
          next: (books) => {
            this.recommendedBooks = books;
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Error al cargar los libros';
            this.isLoading = false;
          }
        });
      }
    } else {
      // Only subscribe if we're on the home page
      if (this.router.url === '/') {
        this.subscription = this.recommendationsService.getRecommendedBooks(currentUser.id).subscribe({
          next: (books) => {
            this.recommendedBooks = books;
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Error al cargar los libros recomendados';
            this.isLoading = false;
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({
      left: -300, // Adjust this value based on your card width + gap
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({
      left: 300, // Adjust this value based on your card width + gap
      behavior: 'smooth'
    });
  }
}
