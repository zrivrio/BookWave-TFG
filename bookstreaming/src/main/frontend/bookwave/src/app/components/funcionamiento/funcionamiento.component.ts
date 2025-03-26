import { Component, Input } from '@angular/core';
import { Book } from '../../models/Book';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-funcionamiento',
  imports: [CommonModule],
  templateUrl: './funcionamiento.component.html',
  styleUrl: './funcionamiento.component.css'
})
export class FuncionamientoComponent {
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
