import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Help } from '../models/Help';
import { HelpStatus } from '../models/HelpStatus';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = 'http://localhost:8080/help';

  constructor(private http: HttpClient) { }

  sendHelpRequest(data: Partial<Help>): Observable<Help> {
    return this.http.post<Help>(this.apiUrl, data);
  }
  getHelpRequestsByUser(userId: number): Observable<Help[]> {
    return this.http.get<Help[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Métodos de Administrador
  getAllHelpRequests(): Observable<Help[]> {
    return this.http.get<Help[]>(`${this.apiUrl}/admin`);
  }

  getHelpRequestById(id: number): Observable<Help> {
    return this.http.get<Help>(`${this.apiUrl}/admin/${id}`);
  }

  deleteHelpRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }

  updateHelpRequest(helpRequest: Help): Observable<Help> {
    return this.http.put<Help>(`${this.apiUrl}/admin`, helpRequest);
  }
}
