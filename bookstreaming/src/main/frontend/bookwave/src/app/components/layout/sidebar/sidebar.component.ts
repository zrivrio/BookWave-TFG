import { Component, Input } from '@angular/core';
import { SidebarLinkComponent } from "../sidebar-link/sidebar-link.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';


@Component({
  selector: 'app-sidebar',
  imports: [SidebarLinkComponent, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route!: string;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(
      user => this.isLoggedIn = !!user
    );
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
