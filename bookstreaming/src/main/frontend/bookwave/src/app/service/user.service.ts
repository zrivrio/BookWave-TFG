import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User';
import { UserSignupRequest } from '../models/UserSignupRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  login(loginRequest: any): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<User>(`${this.baseUrl}/login`, loginRequest, { headers });
  }

  signup(userData: UserSignupRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signup`, userData);
  }

  upgradeToPremium(userId: number): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/upgrade/${userId}`, {});
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    if (user) return user;

    if (typeof localStorage != 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        this.currentUserSubject.next(parsedUser);
        return parsedUser;
      }
    }

    return null;
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}
