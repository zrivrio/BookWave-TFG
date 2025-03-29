import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/category'

  constructor(private http : HttpClient) { }

  getCategories() : Observable<String[]>{
    return this.http.get<String[]>(`${this.apiUrl}/names`);
  }
}
