import { Component } from '@angular/core';
import { AvatarNotificationComponent } from "../../shared/avatar-notification/avatar-notification.component";

@Component({
  selector: 'app-topbar',
  imports: [AvatarNotificationComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

}
