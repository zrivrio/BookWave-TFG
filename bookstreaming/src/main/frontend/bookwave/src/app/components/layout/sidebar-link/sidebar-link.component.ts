import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-link',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-link.component.html',
  styleUrl: './sidebar-link.component.css'
})
export class SidebarLinkComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route?: string;
  @Output() click = new EventEmitter<void>();
  
  constructor(private router: Router) {}

  isActiveRoute(): boolean {
    return this.router.url === this.route;
  }

  onClick(event: Event) {
    if (!this.route) {
      event.preventDefault();
      this.click.emit();
    }
  }
}
