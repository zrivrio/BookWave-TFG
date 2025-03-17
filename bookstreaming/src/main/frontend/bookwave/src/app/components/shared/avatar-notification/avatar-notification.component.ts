import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-notification',
  imports: [],
  templateUrl: './avatar-notification.component.html',
  styleUrl: './avatar-notification.component.css'
})
export class AvatarNotificationComponent {
  @Input() username!: string;
  @Input() avatar!: string;
}
