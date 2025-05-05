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
}
