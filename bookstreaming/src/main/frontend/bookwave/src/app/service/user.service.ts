import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { UserSignupRequest } from '../models/UserSignupRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          this.currentUserSubject.next(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(loginRequest: any): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<User>(`${this.baseUrl}/login`, loginRequest, { headers })
      .pipe(
        tap(user => {
          // Actualizar el usuario actual al hacer login
          this.setCurrentUser(user);
        }),
        catchError(this.handleError)
      );
  }

  signup(userData: UserSignupRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signup`, userData)
      .pipe(
        tap(user => {
          // Actualizar el usuario actual al hacer signup
          this.setCurrentUser(user);
        }),
        catchError(this.handleError)
      );
  }

  upgradeToPremium(userId: number): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/upgrade/${userId}`, {})
      .pipe(
        tap(user => {
          // Actualizar el usuario actual al hacer upgrade
          this.setCurrentUser(user);
        }),
        catchError(this.handleError)
      );
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (typeof localStorage !== 'undefined') {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  updateUser(userId: number, userData: any): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<User>(`${this.baseUrl}/${userId}`, userData, { headers })
      .pipe(
        tap(user => {
          // Si estamos actualizando el usuario actual, actualizar el estado
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === userId) {
            this.setCurrentUser(user);
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error:', error);
    return throwError(() => error);
  }

  // Métodos de Administrador
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/${id}`);
  }

  logout(): void {
    this.clearCurrentUser();
  }
}