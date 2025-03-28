import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';
import { BookService } from '../../../service/book.service';
import { RecommendationsService } from '../../../service/recommendations.service';

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent {
  @Input() book: Book | null = null;

  constructor(private bookService: BookService,
    private recommendationsService: RecommendationsService,
   ) { }

  ngOnInit(): void {
  if (!this.book) {
    this.loadMostPopularBooks();
  }
  }

  private loadMostPopularBooks(): void {
    this.recommendationsService.getMostPopularBook().subscribe(
      books => {
        this.book = books;
      }
    );
  }
}