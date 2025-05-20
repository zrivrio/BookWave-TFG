import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubscriptionCartService } from '../../../service/subscription-cart.service';
import { SubscriptionCart } from '../../../models/SubscriptionCart';
import { SubscriptionType } from '../../../models/SubscriptionType';

@Component({
  selector: 'app-control-carrito',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './control-carrito.component.html',
  styleUrl: './control-carrito.component.css'
})
export class ControlCarritoComponent implements OnInit {
  carts: SubscriptionCart[] = [];
  loading: boolean = true;
  error: string | null = null;
  SubscriptionType = SubscriptionType; 

  constructor(private cartService: SubscriptionCartService) {}

  ngOnInit() {
    this.loadCarts();
  }

  loadCarts() {
    this.loading = true;
    this.cartService.getAllCarts().subscribe({
      next: (carts) => {
        this.carts = carts.map(cart => ({
          ...cart,
          createdAt: cart.createdAt ? new Date(cart.createdAt) : new Date(),
          updatedAt: cart.updatedAt ? new Date(cart.updatedAt) : new Date()
        }));
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los carritos';
        this.loading = false;
        console.error(error);
      }
    });
  }

  deleteCart(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este carrito?')) {
      this.cartService.deleteCart(id).subscribe({
        next: () => {
          this.carts = this.carts.filter(cart => cart.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar el carrito:', error);
          this.error = 'Error al eliminar el carrito';
        }
      });
    }
  }

  getPendingCarts(): number {
    return this.carts.filter(cart => cart.status === 'PENDING').length;
  }

  getCancelledCarts(): number {
    return this.carts.filter(cart => cart.status === 'CANCELLED').length;
  }

  getCompletedCarts(): number {
    return this.carts.filter(cart => cart.status === 'COMPLETED').length;
  }
}