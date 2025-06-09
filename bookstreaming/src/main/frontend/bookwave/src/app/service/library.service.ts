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
    const list = {
        name: name,
        userId: userId
    };
    
    return this.http.post<ReadingList>(
        `${this.apiUrl}/create`,
        list
    );
  }

  deleteList(listId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listId}?userId=${userId}`);
  }

  getBooksInList(listId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/${listId}/books`);
  }

  addBookToList(listId: number, bookId: number, userId: number): Observable<void> {
  return this.http.post<void>(
    `${this.apiUrl}/${listId}/add-book?bookId=${bookId}&userId=${userId}`,
    {} // ✅ Parámetros en la URL, body vacío
  );
}

  removeBookFromList(listId: number, bookId: number, userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${listId}/remove-book?bookId=${bookId}&userId=${userId}`
    );
  }

  // Admin Methods
  getAllReadingLists(): Observable<ReadingList[]> {
    return this.http.get<ReadingList[]>(`${this.apiUrl}/admin`);
  }

  getReadingListByIdAdmin(id: number): Observable<ReadingList> {
    return this.http.get<ReadingList>(`${this.apiUrl}/admin/${id}`);
  }

  saveReadingList(readingList: ReadingList): Observable<ReadingList> {
    return this.http.post<ReadingList>(`${this.apiUrl}/admin`, readingList);
  }

  updateReadingList(readingList: ReadingList): Observable<ReadingList> {
    return this.http.put<ReadingList>(`${this.apiUrl}/admin`, readingList);
  }

  deleteReadingListById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }
}