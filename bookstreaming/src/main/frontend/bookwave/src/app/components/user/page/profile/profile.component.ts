import { Component } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { SubscriptionCartService } from '../../../../service/subscription-cart.service';
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
  showDowngradeMessage: boolean = false;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private subscriptionCartService: SubscriptionCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
      
      if (this.currentUser) {
        this.showUpgradeMessage = this.currentUser.subscriptionType !== SubscriptionType.Premium;
        this.showDowngradeMessage = this.currentUser.subscriptionType === SubscriptionType.Premium;
      }
    });
  }

  navigateToEdit() {
    this.router.navigate(['/profile/edit']);
  }

  upgradeToPremium() {
    this.subscriptionCartService.selectSubscription(SubscriptionType.Premium).subscribe({
      next: (cart) => {
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        console.error('Error selecting subscription:', err);
      }
    });
  }
  
  cancelSubscription() {
    this.subscriptionCartService.selectSubscription(SubscriptionType.Free).subscribe({
      next: (cart) => {
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        console.error('Error selecting subscription:', err);
      }
    });
  }
}