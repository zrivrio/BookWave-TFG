import { Component, Input } from '@angular/core';
import { BookCardComponent } from "../../shared/book-card/book-card.component";

@Component({
  selector: 'app-recommended-books',
  imports: [BookCardComponent],
  templateUrl: './recommended-books.component.html',
  styleUrl: './recommended-books.component.css'
})
export class RecommendedBooksComponent {
  @Input() recommendedBooks: any[] = [];
}
