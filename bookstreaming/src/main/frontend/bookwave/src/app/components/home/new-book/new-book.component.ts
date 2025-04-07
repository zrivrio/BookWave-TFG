import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/book';
import { RecommendationsService } from '../../../service/recommendations.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent implements OnInit, OnDestroy  {
  @Input() book: Book | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private recommendationsService: RecommendationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.book && this.router.url === '/') {
      this.loadMostPopularBooks();
    }
  }

  private loadMostPopularBooks(): void {
    this.subscription = this.recommendationsService.getMostPopularBook().subscribe(
      books => {
        this.book = books;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}