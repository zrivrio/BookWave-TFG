import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../models/Book';
import { RecommendationsService } from '../../../../service/recommendations.service';
import { AuthService } from '../../../../service/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../../../service/library.service';

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
  private subscription: Subscription | null = null;
  private listSubscription: Subscription | null = null;

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
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      // Usuario no autenticado - mostrar libros aleatorios
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
      // Usuario autenticado - primero obtener las listas de lectura
      if (this.router.url === '/') {
        this.listSubscription = this.libraryService.getLists(currentUser.id).subscribe({
          next: (lists) => {
            if (lists.length === 0) {
              // Usuario SIN listas de lectura - mostrar libros aleatorios
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
            } else {
              // Usuario CON listas de lectura - mostrar recomendaciones personalizadas
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
          },
          error: (err) => {
            this.error = 'Error al cargar las listas de lectura';
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
    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
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