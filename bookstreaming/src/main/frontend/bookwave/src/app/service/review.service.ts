import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/Review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/review';

  constructor(private http: HttpClient) { }

  getReviewsByBook(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/book/${bookId}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
}