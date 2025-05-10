import { Component } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { SubscriptionCartService } from '../../../../service/subscription-cart.service';
import { SubscriptionType } from '../../../../models/SubscriptionType';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HelpStatus } from '../../../../models/HelpStatus';
import { Help } from '../../../../models/Help';
import { HelpService } from '../../../../service/help.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentUser: any = null;
  showUpgradeMessage: boolean = false;
  showDowngradeMessage: boolean = false;
  isLoading: boolean = true;
  userHelpRequests: Help[] = [];
  helpLoading: boolean = false;
  HelpStatus = HelpStatus;
  
  constructor(
    private authService: AuthService,
    private subscriptionCartService: SubscriptionCartService,
    private router: Router,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
      
      if (this.currentUser) {
        this.showUpgradeMessage = this.currentUser.subscriptionType !== SubscriptionType.Premium;
        this.showDowngradeMessage = this.currentUser.subscriptionType === SubscriptionType.Premium;
        this.loadUserHelpRequests();
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

  loadUserHelpRequests() {
    this.helpLoading = true;
    this.helpService.getHelpRequestsByUser(this.currentUser.id).subscribe({
      next: (requests) => {
        this.userHelpRequests = requests;
        this.helpLoading = false;
      },
      error: (err) => {
        console.error('Error loading help requests:', err);
        this.helpLoading = false;
      }
    });
  }

  getStatusClass(status: HelpStatus): string {
    switch(status) {
      case HelpStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700';
      case HelpStatus.RESOLVED:
        return 'bg-green-100 text-green-700';
      case HelpStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }
}