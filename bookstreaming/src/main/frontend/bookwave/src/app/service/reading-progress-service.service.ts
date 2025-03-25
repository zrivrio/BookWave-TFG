import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ReadingProgress } from '../models/ReadinProgress';


@Injectable({
  providedIn: 'root'
})
export class ReadingProgressService {
  private apiUrl = 'http://localhost:8080/reading-progress';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el progreso de lectura
   * @param userId (opcional) ID del usuario para filtrar
   * @returns Observable con array de ReadingProgress
   */
  getInProgressBooks(userId?: number): Observable<ReadingProgress[]> {
    // Configuración de parámetros
    let params = new HttpParams();
    if (userId) {
      params = params.append('userId', userId.toString());
    }

    return this.http.get<ReadingProgress[]>(`${this.apiUrl}/in-progress`, { 
      params,
      headers: { 'Accept': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en ReadingProgressService:', error);
    let errorMessage = 'Error al cargar el progreso de lectura';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}