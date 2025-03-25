import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';

@Component({
  selector: 'app-recommended-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommended-books.component.html',
  styleUrl: './recommended-books.component.css'
})
export class RecommendedBooksComponent {
  @Input() book?: Book;
}