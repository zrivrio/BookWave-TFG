import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Book } from '../models/Book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/books'

  constructor(private http : HttpClient) { }

  //Usuario
  getUserBooks(userId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/user/${userId}`);
}

getRecommendedBooks(userId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/recommendedBooks/${userId}`);
}

getBooksInProgress(userId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/progress/${userId}`);
}

getBooksBySearch(searchTerm: string): Observable<Book[]> {
  return this.http.get<Book[]>(`${this.apiUrl}/search/${searchTerm}`);
}




  //Administrador
  getBooks() : Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl);
  }
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
