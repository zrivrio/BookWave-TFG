import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BookService} from './book/service/book.service';
import { SidebarComponent } from './fragmentos/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bookwave';
}
