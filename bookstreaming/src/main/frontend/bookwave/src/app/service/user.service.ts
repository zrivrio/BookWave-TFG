import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials)
      .pipe(
        catchError(error => {
          throw new Error('Usuario o contraseña incorrectos');
        })
      );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }
}