import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { ReadingList } from '../models/ReadingList';

@Injectable({
  providedIn: 'root'
})
export class ReadinglistService {
  private apiUrl = 'http://localhost:8080/list';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getUserLists(userId: number): Observable<ReadingList[]> {
    return this.http.get<ReadingList[]>(`${this.apiUrl}/user/${userId}`);
  }

  createList(listData: { name: string, userId: number }): Observable<ReadingList> {
    return this.http.post<ReadingList>(this.apiUrl, listData);
  }

  addBookToList(listId: number, bookId: number): Observable<ReadingList> {
    return this.http.post<ReadingList>(`${this.apiUrl}/${listId}/books`, { bookId });
  }

  canCreateMoreLists(currentCount: number): boolean {
    const user = this.userService.getCurrentUser();
    if (!user) return false;
    
    return user.subscriptionType === 'Premium' || currentCount < 5;
  }

}
