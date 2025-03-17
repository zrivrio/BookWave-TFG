import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from "./components/layout/topbar/topbar.component";
import { SidebarComponent } from './components/layout/sidebar/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bookwave';
}
