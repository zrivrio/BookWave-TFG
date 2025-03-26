import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../models/Book';

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent {
  @Input() book: Book | null = null;
}