import { Component } from '@angular/core';
import { SidebarLinkComponent } from "../sidebar-link/sidebar-link.component";

@Component({
  selector: 'app-sidebar',
  imports: [SidebarLinkComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
