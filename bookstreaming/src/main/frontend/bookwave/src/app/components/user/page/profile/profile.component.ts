import { Component } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { UserService } from '../../../../service/user.service';
import { SubscriptionType } from '../../../../models/SubscriptionType';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentUser: any = null;
  showUpgradeMessage: boolean = false;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
      
      if (this.currentUser) {
        this.showUpgradeMessage = this.currentUser.subscriptionType !== SubscriptionType.Premium;
      }
    });
  }

  navigateToEdit() {
    this.router.navigate(['/profile/edit']);
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout'], { 
      state: { 
        product: 'premium_subscription',
        price: 9.99
      }
    });
  }
}