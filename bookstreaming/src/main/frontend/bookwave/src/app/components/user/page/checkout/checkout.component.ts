import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { SubscriptionCartService } from '../../../../service/subscription-cart.service';
import { CommonModule } from '@angular/common';
import { SubscriptionCart } from '../../../../models/SubscriptionCart';
import { SubscriptionType } from '../../../../models/SubscriptionType';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: SubscriptionCart | null = null;
  isLoading = false;
  paymentSuccess = false;
  paymentError: string | null = null;
  selectedPaymentMethod = 'creditCard';

  paymentMethods = [
    { id: 'creditCard', name: 'Tarjeta de Crédito', icon: 'credit_card' },
    { id: 'paypal', name: 'PayPal', icon: 'payments' },
    { id: 'bankTransfer', name: 'Transferencia Bancaria', icon: 'account_balance' }
  ];

  constructor(
    private cartService: SubscriptionCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        if (!cart) {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error('Error getting cart:', err);
        this.router.navigate(['/profile']);
      }
    });
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  processPayment(): void {
    if (!this.cart?.id) {
      this.paymentError = 'No hay carrito activo';
      return;
    }

    this.isLoading = true;
    this.paymentError = null;

    this.cartService.processCheckout(this.cart.id).subscribe({
      next: (updatedCart) => {
        this.paymentSuccess = true;
        this.isLoading = false;
        this.updateLocalUser(updatedCart.selectedSubscription);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {
        this.paymentError = err.message || 'Error al procesar el pago';
        this.isLoading = false;
      }
    });
  }

  private updateLocalUser(newSubscription: SubscriptionType): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.authService.setCurrentUser({
        ...currentUser,
        subscriptionType: newSubscription
      });
    }
  }

  get isUpgrade(): boolean {
    return this.cart?.selectedSubscription === 'Premium';
  }

  get isCancellation(): boolean {
    return this.cart?.selectedSubscription === 'Free';
  }
}