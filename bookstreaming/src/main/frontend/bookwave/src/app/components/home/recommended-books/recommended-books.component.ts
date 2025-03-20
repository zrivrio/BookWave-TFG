import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-recommended-books',
  imports: [CommonModule],
  templateUrl: './recommended-books.component.html',
  styleUrl: './recommended-books.component.css'
})
export class RecommendedBooksComponent {
  @Input() book: any;
}