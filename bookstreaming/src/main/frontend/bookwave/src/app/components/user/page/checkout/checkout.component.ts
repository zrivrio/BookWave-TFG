import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { UserService } from '../../../../service/user.service';
import { SubscriptionType } from '../../../../models/SubscriptionType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  product: string = '';
  price: number = 0;
  isLoading: boolean = false;
  paymentSuccess: boolean = false;
  paymentError: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      product: string,
      price: number
    };
    
    if (state) {
      this.product = state.product;
      this.price = state.price;
    }
  }

  processPayment() {
    this.isLoading = true;
    this.paymentError = null;
    
    // Simulación de pago exitoso
    setTimeout(() => {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          subscriptionType: SubscriptionType.Premium
        };
        
        this.authService.setCurrentUser(updatedUser);
        this.paymentSuccess = true;
        this.isLoading = false;
      } else {
        this.paymentError = 'Usuario no autenticado';
        this.isLoading = false;
      }
    }, 2000);
  }
}