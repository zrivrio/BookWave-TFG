import { Component } from '@angular/core';
import { AvatarNotificationComponent } from "../../shared/avatar-notification/avatar-notification.component";
import { LoginButtonComponent } from "../../shared/login-button/login-button.component";

@Component({
  selector: 'app-topbar',
  imports: [AvatarNotificationComponent, LoginButtonComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

}
