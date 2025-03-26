import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Book } from '../../../models/Book';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-continue-reading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent {
  @Input() book!: Book;
  @Input() isLoading: boolean = false;
  @Input() error: string = '';
  @Input() isLoggedIn: boolean = false;

  getProgressPercentage(): number {
    if (this.book && this.book.readingProgress) {
      return this.book.readingProgress.percentageRead;
    }
    return 0;
  }
}