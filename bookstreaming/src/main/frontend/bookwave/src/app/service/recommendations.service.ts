import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/Book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  private apiUrl = 'http://localhost:8080/recommendations'

  constructor(private http : HttpClient) { }

  getRecommendedBooks(userId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/${userId}`);
}
  getMostPopularBook(): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/popular`);
  }

  getRandomBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/random`);
  }



}
