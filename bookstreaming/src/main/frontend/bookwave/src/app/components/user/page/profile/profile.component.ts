import { Component } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { UserService } from '../../../../service/user.service';
import { SubscriptionType } from '../../../../models/SubscriptionType';
import { CommonModule } from '@angular/common';

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
    private userService: UserService
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

  upgradeToPremium(): void {
    if (!this.currentUser) return;
    
    this.isUpgrading = true;
    this.upgradeError = null;
    
    // Simulación de llamada al servicio
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
