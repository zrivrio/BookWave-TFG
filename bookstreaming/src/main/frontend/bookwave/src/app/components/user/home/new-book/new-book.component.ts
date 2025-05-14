import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../models/Book';
import { RecommendationsService } from '../../../../service/recommendations.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ReadingProgressService } from '../../../../service/reading-progress.service';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../models/User';
import { ReadingProgress } from '../../../../models/ReadinProgress';
import { AddToReadingListComponent } from '../../add-to-reading-list/add-to-reading-list.component';


@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule, RouterModule, AddToReadingListComponent],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent implements OnInit, OnDestroy {
  @Input() book: Book | null = null;
  private subscription: Subscription | null = null;
  currentUser: User | null = null;

  constructor(
    private recommendationsService: RecommendationsService,
    private router: Router,
    private userService: UserService,
    private readingProgressService: ReadingProgressService
  ) { }

  ngOnInit(): void {
    if (!this.book && this.router.url === '/') {
      this.loadMostPopularBooks();
    }
    this.currentUser = this.userService.getCurrentUser();
  }

  private loadMostPopularBooks(): void {
    this.subscription = this.recommendationsService.getMostPopularBook().subscribe(
      books => {
        this.book = books;
      }
    );
  }

  onReadNow(): void {
    if (!this.currentUser || !this.book) {
      console.warn('Usuario o libro no disponible');
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
        console.log('Progreso de lectura guardado:', savedProgress);
        this.router.navigate(['/progress']);
      },
      error: (err) => {
        console.error('Error al guardar el progreso de lectura:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}