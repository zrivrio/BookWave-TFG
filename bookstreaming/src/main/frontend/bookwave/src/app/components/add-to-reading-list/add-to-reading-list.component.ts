import { Component, Input, OnInit } from '@angular/core';
import { ReadingList } from '../../models/ReadingList';
import { LibraryService } from '../../service/library.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-add-to-reading-list',
  templateUrl: './add-to-reading-list.component.html',
  styleUrls: ['./add-to-reading-list.component.scss']
})
export class AddToReadingListComponent implements OnInit {
  @Input() bookId!: number;
  
  readingLists: ReadingList[] = [];
  selectedListId: number | null = null;
  loading = false;
  error = '';
  success = '';
  userId: number | null = null;

  constructor(
    private readingListService: LibraryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    this.userId = user?.id || null;
    if (this.userId) {
      this.loadUserLists();
    }
  }

  loadUserLists(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.readingListService.getLists(this.userId).subscribe({
      next: (lists: ReadingList[]) => {
        this.readingLists = lists;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar las listas de lectura';
        this.loading = false;
        console.error(err);
      }
    });
  }

  addToList(): void {
    if (!this.userId || !this.selectedListId || !this.bookId) {
      this.error = 'Selecciona una lista para añadir el libro';
      return;
    }
    
    this.loading = true;
    this.readingListService.addBookToList(this.selectedListId, this.bookId, this.userId).subscribe({
      next: () => {
        this.success = 'Libro añadido a la lista con éxito';
        this.loading = false;
        this.selectedListId = null;
      },
      error: (err) => {
        this.error = err.error || 'Error al añadir el libro a la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }
}