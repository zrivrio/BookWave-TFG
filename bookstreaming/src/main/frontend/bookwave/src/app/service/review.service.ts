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

    getAverageRatingByBook(bookId: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/book/${bookId}/average-rating`);
    }

    createReview(review: Review): Observable<Review> {
        return this.http.post<Review>(this.apiUrl, review);
    }

    getAllReviews(): Observable<Review[]> {
        return this.http.get<Review[]>(this.apiUrl);
    }

    deleteReview(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}