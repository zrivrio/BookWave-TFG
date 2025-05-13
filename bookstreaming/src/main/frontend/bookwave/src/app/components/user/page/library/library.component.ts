import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibraryService } from '../../../../service/library.service';
import { ReadingList } from '../../../../models/ReadingList';
import { Book } from '../../../../models/Book';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  readingLists: ReadingList[] = [];
  selectedList: ReadingList | null = null;
  booksInSelectedList: Book[] = [];
  newListForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  userId: number | null = null;
  isPremiumUser = false;


  constructor(
    private readingListService: LibraryService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.newListForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }


  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    this.userId = user?.id || null;
    this.isPremiumUser = user?.subscriptionType === 'Premium';
    
    if (this.userId) {
      this.loadUserLists();
    }
  }

  loadUserLists(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.error = '';
    
    this.readingListService.getLists(this.userId).subscribe({
        next: (lists: ReadingList[]) => {
            this.readingLists = lists;
            
            // Cargar los libros para cada lista de manera secuencial
            lists.forEach(list => {
                if (list.id) {
                    this.readingListService.getBooksInList(list.id).subscribe({
                        next: (books: Book[]) => {
                            const index = this.readingLists.findIndex(l => l.id === list.id);
                            if (index !== -1) {
                                this.readingLists[index].books = books;
                                
                                // Si es la primera lista, seleccionarla automáticamente
                                if (index === 0 && !this.selectedList) {
                                    this.selectList(this.readingLists[index]);
                                }
                            }
                        },
                        error: (err) => {
                            console.error('Error al cargar los libros de la lista:', err);
                            const index = this.readingLists.findIndex(l => l.id === list.id);
                            if (index !== -1) {
                                this.readingLists[index].books = [];
                            }
                        }
                    });
                }
            });
            
            this.loading = false;
        },
        error: (err: any) => {
            this.error = 'Error al cargar las listas de lectura';
            this.loading = false;
            console.error('Error:', err);
        }
    });
}
  selectList(list: ReadingList): void {
    console.log('Lista seleccionada:', list);
    this.selectedList = list;
    this.loadBooksInList(list.id!);
  }

  loadBooksInList(listId: number): void {
    this.loading = true;
    this.readingListService.getBooksInList(listId).subscribe({
      next: (books: Book[]) => {
        this.booksInSelectedList = books;
        this.loading = false;
        console.log('Libros en lista:', this.booksInSelectedList);
      },
      error: (err: any) => {
        this.error = 'Error al cargar los libros de la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createNewList(): void {
    if (this.newListForm.invalid || !this.userId) return;
    
    const name = this.newListForm.get('name')?.value;
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.readingListService.createList(this.userId, name).subscribe({
        next: (list: ReadingList) => {
            this.readingLists.push(list);
            this.newListForm.reset();
            this.success = 'Lista creada con éxito';
            this.loading = false;
        },
        error: (err) => {
            this.error = err.error?.message || err.message || 'Error al crear la lista';
            this.loading = false;
            console.error(err);
        }
    });
}

  deleteList(list: ReadingList): void {
    if (!this.userId || !list.id) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar la lista "${list.name}"?`)) {
      this.loading = true;
      this.readingListService.deleteList(list.id, this.userId).subscribe({
        next: () => {
          this.readingLists = this.readingLists.filter(l => l.id !== list.id);
          if (this.selectedList?.id === list.id) {
            this.selectedList = null;
            this.booksInSelectedList = [];
          }
          this.success = 'Lista eliminada con éxito';
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.error || 'Error al eliminar la lista';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  removeBookFromList(book: Book): void {
    if (!this.userId || !this.selectedList?.id || !book.id) return;
    
    this.loading = true;
    this.readingListService.removeBookFromList(this.selectedList.id, book.id, this.userId).subscribe({
      next: () => {
        this.booksInSelectedList = this.booksInSelectedList.filter(b => b.id !== book.id);
        this.success = 'Libro eliminado de la lista';
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error || 'Error al eliminar el libro de la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }
}