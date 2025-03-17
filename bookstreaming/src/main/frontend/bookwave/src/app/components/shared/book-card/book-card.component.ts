import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: { title: string; category: string; image: string; progress?: number; };
  @Input() showProgress: boolean = false;

}
