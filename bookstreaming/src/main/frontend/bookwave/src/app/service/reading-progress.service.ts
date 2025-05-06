import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReadingProgress } from '../models/ReadinProgress';
import { Book } from '../models/Book';

@Injectable({
  providedIn: 'root'
})
export class ReadingProgressService {
  private apiUrl = 'http://localhost:8080/reading-progress';

  constructor(private http: HttpClient) { }

  getReadingProgress(userId: number, bookId: number): Observable<ReadingProgress> {
    return this.http.get<ReadingProgress>(`${this.apiUrl}/user/${userId}/book/${bookId}`);
  }

  createReadingProgress(progress: Omit<ReadingProgress, 'id'>): Observable<ReadingProgress> {
    return this.http.post<ReadingProgress>(this.apiUrl, progress);
  }

  updateReadingProgress(progress: ReadingProgress): Observable<ReadingProgress> {
    return this.http.put<ReadingProgress>(`${this.apiUrl}/${progress.id}`, progress);
  }

  deleteReadingProgress(progressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${progressId}`);
  }

  getBooksInProgress(userId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/user/${userId}/books`);
  }

  // Métodos de Administrador
  getAllReadingProgress(): Observable<ReadingProgress[]> {
    return this.http.get<ReadingProgress[]>(`${this.apiUrl}/admin`);
  }

  getReadingProgressById(id: number): Observable<ReadingProgress> {
    return this.http.get<ReadingProgress>(`${this.apiUrl}/admin/${id}`);
  }

  createReadingProgressAdmin(readingProgress: ReadingProgress): Observable<ReadingProgress> {
    return this.http.post<ReadingProgress>(`${this.apiUrl}/admin`, readingProgress);
  }

  updateReadingProgressAdmin(readingProgress: ReadingProgress): Observable<ReadingProgress> {
    return this.http.put<ReadingProgress>(`${this.apiUrl}/admin`, readingProgress);
  }
}
