import { Component, Input } from '@angular/core';
import { BookCardComponent } from "../../shared/book-card/book-card.component";

@Component({
  selector: 'app-continue-reading',
  imports: [BookCardComponent],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent {
  @Input() showProgress: boolean = false;
  @Input() continueReadingBooks: any[] = [];
}
