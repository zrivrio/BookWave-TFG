import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mapa } from '../models/Mapa';
import { Book } from '../models/Book';
import { Category } from '../models/Category';

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

  // Métodos de Administrador
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/admin`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/admin/${id}`);
  }

  saveCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/admin`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/admin`, category);
  }
}
