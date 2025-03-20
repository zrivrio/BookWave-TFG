import { Component, Input } from '@angular/core';
import { SidebarLinkComponent } from "../sidebar-link/sidebar-link.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  imports: [SidebarLinkComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route!: string;
  isLoggedIn: boolean = false; // o true si está logueado

  constructor(/* tu servicio de auth aquí */) {
    // Si tienes un servicio de autenticación, podrías hacer algo así:
    // this.isLoggedIn = this.authService.isAuthenticated();

    // O suscribirte a un observable de autenticación:
    // this.authService.authStatus.subscribe(status => this.isLoggedIn = status);
  }
 
}
