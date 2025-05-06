import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = 'http://localhost:8080/help';

  constructor(private http: HttpClient) { }

  sendHelpRequest(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Métodos de Administrador
  getAllHelpRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin`);
  }

  getHelpRequestById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/${id}`);
  }

  deleteHelpRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }

  updateHelpRequest(helpRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin`, helpRequest);
  }
}
