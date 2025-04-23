import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/Book';
import { ReadingList } from '../models/ReadingList';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = 'http://localhost:8080/list';

  constructor(private http: HttpClient) { }

  getLists(userId: number): Observable<ReadingList[]> {
    return this.http.get<ReadingList[]>(`${this.apiUrl}/user/${userId}`);
  }

  createList(userId: number, name: string): Observable<ReadingList> {
    return this.http.post<ReadingList>(`${this.apiUrl}/create`, { name }, {
      params: { userId: userId.toString() }
    });
  }

  deleteList(listId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listId}`, {
      params: { userId: userId.toString() }
    });
  }

  getBooksInList(listId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/${listId}/books`);
  }

  addBookToList(listId: number, bookId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${listId}/add-book`, null, {
      params: { 
        bookId: bookId.toString(),
        userId: userId.toString()
      }
    });
  }

  removeBookFromList(listId: number, bookId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listId}/remove-book`, {
      params: { 
        bookId: bookId.toString(),
        userId: userId.toString()
      }
    });
  }
}