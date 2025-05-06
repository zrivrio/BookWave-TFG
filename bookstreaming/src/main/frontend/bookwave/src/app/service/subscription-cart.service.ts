import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { SubscriptionCart } from '../models/SubscriptionCart';
import { SubscriptionType } from '../models/SubscriptionType';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionCartService {
  private currentCartSubject = new BehaviorSubject<SubscriptionCart | null>(null);
  public currentCart$ = this.currentCartSubject.asObservable();
  private apiUrl = 'http://localhost:8080/cart';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get current cart with userId
  getCurrentCart(): Observable<SubscriptionCart> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<SubscriptionCart>(`${this.apiUrl}?userId=${userId}`);
  }

  // Select subscription with userId
  selectSubscription(subscriptionType: SubscriptionType): Observable<SubscriptionCart> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.post<SubscriptionCart>(
      `${this.apiUrl}/select-subscription?userId=${userId}&subscriptionType=${subscriptionType}`,
      {}
    );
  }

  // Process checkout with cartId
  processCheckout(cartId: number): Observable<SubscriptionCart> {
    return this.http.post<SubscriptionCart>(
      `${this.apiUrl}/checkout?cartId=${cartId}`,
      {}
    );
  }

  // Métodos de Administrador
  getAllCarts(): Observable<SubscriptionCart[]> {
    return this.http.get<SubscriptionCart[]>(`${this.apiUrl}/admin`);
  }

  getCartById(id: number): Observable<SubscriptionCart> {
    return this.http.get<SubscriptionCart>(`${this.apiUrl}/admin/${id}`);
  }

  saveCart(cart: SubscriptionCart): Observable<SubscriptionCart> {
    return this.http.post<SubscriptionCart>(`${this.apiUrl}/admin`, cart);
  }

  deleteCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }

  updateCart(cart: SubscriptionCart): Observable<SubscriptionCart> {
    return this.http.put<SubscriptionCart>(`${this.apiUrl}/admin`, cart);
  }
}