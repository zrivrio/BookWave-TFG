import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { SubscriptionCartService } from '../../../../service/subscription-cart.service';
import { CommonModule } from '@angular/common';
import { SubscriptionCart } from '../../../../models/SubscriptionCart';
import { SubscriptionType } from '../../../../models/SubscriptionType';
import { UserService } from '../../../../service/user.service';

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

  constructor(
    private cartService: SubscriptionCartService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadOrCreateCart();
  }

  private loadOrCreateCart(): void {
    this.isLoading = true;
    
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('No existe carrito, creando uno nuevo...');
        this.createNewCart();
      }
    });
  }

  private createNewCart(): void {
    this.cartService.selectSubscription(SubscriptionType.Premium).subscribe({
      next: (newCart) => {
        this.cart = newCart;
        this.isLoading = false;
        console.log('Carrito creado exitosamente:', newCart);
      },
      error: (err) => {
        console.error('Error creando carrito:', err);
        this.paymentError = 'Error al crear el carrito';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      }
    });
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  changeSubscription(subscriptionType: SubscriptionType): void {
    if (!this.cart) return;

    this.isLoading = true;
    this.paymentError = null;

    this.cartService.selectSubscription(subscriptionType).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cambiando suscripción:', err);
        this.paymentError = 'Error al cambiar la suscripción';
        this.isLoading = false;
      }
    });
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
            
            if (updatedCart.status === 'COMPLETED') {
                this.updateLocalUser(updatedCart.selectedSubscription);
                
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
            }
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
    return this.cart?.selectedSubscription === SubscriptionType.Premium;
  }

  get isCancellation(): boolean {
    return this.cart?.selectedSubscription === SubscriptionType.Free;
  }

  get canProcessPayment(): boolean {
    return !this.isLoading && this.cart?.id != null && !this.paymentSuccess;
  }
}