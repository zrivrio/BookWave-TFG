import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {

  private apiUrl = 'http://localhost:8080/bookwave/books';

  constructor(private http: HttpClient) {}

  obtenerLibros(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
