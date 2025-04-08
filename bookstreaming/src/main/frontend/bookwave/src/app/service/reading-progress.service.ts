import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReadingProgress } from '../models/ReadinProgress';

@Injectable({
  providedIn: 'root'
})
export class ReadingProgressService {
  private apiUrl = 'http://localhost:8080/reading-progress';

  constructor(private http: HttpClient) { }

  // Obtener progreso de lectura para un usuario y libro específico
  getReadingProgress(userId: number, bookId: number): Observable<ReadingProgress> {
    return this.http.get<ReadingProgress>(`${this.apiUrl}/user/${userId}/book/${bookId}`);
  }

  // Crear un nuevo registro de progreso
  createReadingProgress(progress: Omit<ReadingProgress, 'id'>): Observable<ReadingProgress> {
    return this.http.post<ReadingProgress>(this.apiUrl, progress);
  }

  // Actualizar un progreso existente
  updateReadingProgress(progress: ReadingProgress): Observable<ReadingProgress> {
    return this.http.put<ReadingProgress>(`${this.apiUrl}/${progress.id}`, progress);
  }

  // Método alternativo que puede crear o actualizar según si existe ID
  saveReadingProgress(progress: ReadingProgress): Observable<ReadingProgress> {
    if (progress.id) {
      return this.updateReadingProgress(progress);
    } else {
      return this.createReadingProgress(progress);
    }
  }

}
