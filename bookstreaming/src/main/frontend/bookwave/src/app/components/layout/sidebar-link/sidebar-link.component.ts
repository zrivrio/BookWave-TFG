import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-link',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-link.component.html',
  styleUrl: './sidebar-link.component.css'
})
export class SidebarLinkComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route!: string;
  constructor(private router: Router) {}

  isActiveRoute(): boolean {
    return this.router.url === this.route;
  }
}
