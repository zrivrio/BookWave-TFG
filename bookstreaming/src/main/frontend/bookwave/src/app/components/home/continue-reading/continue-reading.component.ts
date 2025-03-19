import { Component, Input } from '@angular/core';
import { BookCardComponent } from "../../shared/book-card/book-card.component";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-continue-reading',
  imports: [BookCardComponent, CommonModule],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent {
  @Input() showProgress: boolean = false;
  @Input() continueReadingBooks: any[] = [];
}
