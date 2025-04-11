import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mapa } from '../models/Mapa';
import { Book } from '../models/Book';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/category'

  constructor(private http : HttpClient) { }

  getCategories() : Observable<Mapa[]>{
    return this.http.get<Mapa[]>(`${this.apiUrl}/names`);
  }

  getBooksByCategory(id: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/${id}`);
  }
}
