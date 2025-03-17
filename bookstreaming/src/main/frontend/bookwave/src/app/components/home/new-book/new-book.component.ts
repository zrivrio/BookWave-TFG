import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-new-book',
  imports: [ButtonComponent],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent {
  @Input() featuredBook!: { title: string; description: string; image: string; };
}
