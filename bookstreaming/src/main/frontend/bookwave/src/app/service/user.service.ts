import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User';
import { UserSignupRequest } from '../models/UserSignupRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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
}
