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
  isUpgrading: boolean = false;
  upgradeSuccess: boolean = false;
  upgradeError: string | null = null;
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

  upgradeToPremium(): void {
    if (!this.currentUser) return;
    
    this.isUpgrading = true;
    this.upgradeError = null;
    
    setTimeout(() => {
      const updatedUser = {
        ...this.currentUser,
        subscriptionType: SubscriptionType.Premium
      };
      
      this.currentUser = updatedUser;
      this.authService.setCurrentUser(updatedUser);
      this.showUpgradeMessage = false;
      this.upgradeSuccess = true;
      this.isUpgrading = false;
      
      setTimeout(() => this.upgradeSuccess = false, 3000);
    }, 1500);
  }
}
