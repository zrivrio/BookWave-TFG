import { Component, Input, OnInit } from '@angular/core';
import { ReadingList } from '../../models/ReadingList';
import { LibraryService } from '../../service/library.service';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../models/Book';
import { BookService } from '../../service/book.service';

@Component({
  selector: 'app-add-to-reading-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
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
  showModal = false;
  newListForm: FormGroup;
  searchTerm = '';
  searchResults: Book[] = [];
  isSearching = false;

  constructor(
    private readingListService: LibraryService,
    private userService: UserService,
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.newListForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

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
    this.error = '';
    this.success = '';
    
    this.readingListService.addBookToList(this.selectedListId, this.bookId, this.userId).subscribe({
      next: () => {
        this.success = 'Libro añadido a la lista con éxito';
        this.loading = false;
        this.selectedListId = null;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al añadir el libro a la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createNewList(): void {
    if (this.newListForm.invalid || !this.userId) return;
    
    const name = this.newListForm.get('name')?.value;
    this.loading = true;
    
    this.readingListService.createList(this.userId, name).subscribe({
      next: (list: ReadingList) => {
        this.readingLists.push(list);
        this.newListForm.reset();
        this.success = 'Lista creada con éxito';
        this.loading = false;
        this.showModal = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Error al crear la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  searchBooks(): void {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    
    this.isSearching = true;
    this.bookService.getBooksBySearch(this.searchTerm).subscribe({
      next: (books: Book[]) => {
        this.searchResults = books;
        this.isSearching = false;
      },
      error: (err) => {
        this.error = 'Error al buscar libros';
        this.isSearching = false;
        console.error(err);
      }
    });
  }

  selectBookFromSearch(book: Book): void {
    this.bookId = book.id;
    this.searchTerm = book.title;
    this.searchResults = [];
  }

  openModal(): void {
    this.showModal = true;
    this.newListForm.reset();
    this.error = '';
  }

  closeModal(): void {
    this.showModal = false;
  }
}