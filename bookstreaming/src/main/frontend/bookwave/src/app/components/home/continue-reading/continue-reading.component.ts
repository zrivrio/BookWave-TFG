import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-continue-reading',
  imports: [ CommonModule],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent {

  @Input() book: any;
}