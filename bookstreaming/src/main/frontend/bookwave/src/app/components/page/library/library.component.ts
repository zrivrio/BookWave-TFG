import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../../service/library.service';
import { UserService } from '../../../service/user.service';
import { BookService } from '../../../service/book.service';
import { ReadingList } from '../../../models/ReadingList';
import { Book } from '../../../models/Book';
import { User } from '../../../models/User';
import { SubscriptionType } from '../../../models/SubscriptionType';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../../category/search/search.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SearchComponent],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  MAX_LISTS_FREE = 5;
  MAX_BOOKS_PER_LIST = 10;
  filteredBooks: Book[] = [];
  searchTerm = '';
  currentUser: User | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  lists: ReadingList[] = [];
  selectedList: ReadingList | null = null;
  showAddListForm = false;
  newListName = '';
  availableBooks: Book[] = [];
  showAddBookModal = false;
  selectedBookToAdd: Book | null = null;

  constructor(
    private userService: UserService,
    private libraryService: LibraryService,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.loadLists();
      this.loadAvailableBooks();
    }
  }

  loadLists(): void {
    this.libraryService.getLists(this.currentUser!.id).subscribe({
      next: (lists: ReadingList[]) => {
        this.lists = lists;
      },
      error: (err: any) => this.errorMessage = 'Error al cargar listas: ' + err.message
    });
  }
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.filterBooks();
  }
  filterBooks(): void {
    if (!this.searchTerm) {
      this.filteredBooks = [...this.availableBooks];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.availableBooks.filter(book => 
      book.title.toLowerCase().includes(term) || 
      (book.author && book.author.toLowerCase().includes(term))
    );
  }

  loadAvailableBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.availableBooks = books;
        this.filteredBooks = [...books];
      },
      error: (err: any) => this.errorMessage = 'Error al cargar libros: ' + err.message
    });
  }

  selectList(list: ReadingList): void {
    this.selectedList = list;
  }

  addList(): void {
    if (!this.newListName.trim()) {
      this.errorMessage = 'El nombre de la lista no puede estar vacío';
      return;
    }

    if (this.currentUser?.subscriptionType !== SubscriptionType.Premium && 
        this.lists.length >= this.MAX_LISTS_FREE) {
      this.errorMessage = `Límite de ${this.MAX_LISTS_FREE} listas alcanzado. Actualiza a Premium para crear más.`;
      return;
    }

    this.libraryService.createList(this.currentUser!.id, this.newListName).subscribe({
      next: (createdList: ReadingList) => {
        this.lists.push(createdList);
        this.newListName = '';
        this.showAddListForm = false;
        this.successMessage = `Lista "${createdList.name}" creada con éxito`;
      },
      error: (err: any) => this.errorMessage = 'Error al crear lista: ' + err.message
    });
  }

  removeList(list: ReadingList): void {
    this.libraryService.deleteList(list.id, this.currentUser!.id).subscribe({
      next: () => {
        this.lists = this.lists.filter(l => l.id !== list.id);
        if (this.selectedList?.id === list.id) {
          this.selectedList = null;
        }
        this.successMessage = `Lista "${list.name}" eliminada con éxito`;
      },
      error: (err: any) => this.errorMessage = 'Error al eliminar lista: ' + err.message
    });
  }

  openAddBookModal(): void {
    if (!this.selectedList) {
      this.errorMessage = 'Selecciona una lista primero';
      return;
    }
    this.showAddBookModal = true;
  }

  addBookToList(): void {
    if (!this.selectedList || !this.selectedBookToAdd) {
      this.errorMessage = 'Selecciona un libro para añadir';
      return;
    }

    if (this.currentUser?.subscriptionType !== SubscriptionType.Premium && 
        this.selectedList.books.length >= this.MAX_BOOKS_PER_LIST) {
      this.errorMessage = `Límite de ${this.MAX_BOOKS_PER_LIST} libros por lista alcanzado. Actualiza a Premium para más.`;
      return;
    }

    this.libraryService.addBookToList(
      this.selectedList.id, 
      this.selectedBookToAdd.id, 
      this.currentUser!.id
    ).subscribe({
      next: () => {
        if (this.selectedList) {
          this.selectedList.books.push(this.selectedBookToAdd!);
        }
        this.successMessage = `Libro "${this.selectedBookToAdd!.title}" añadido a la lista`;
        this.showAddBookModal = false;
        this.selectedBookToAdd = null;
      },
      error: (err: any) => this.errorMessage = 'Error al añadir libro: ' + err.message
    });
  }

  removeBookFromList(book: Book): void {
    if (!this.selectedList) return;

    this.libraryService.removeBookFromList(
      this.selectedList.id, 
      book.id, 
      this.currentUser!.id
    ).subscribe({
      next: () => {
        if (this.selectedList) {
          this.selectedList.books = this.selectedList.books.filter(b => b.id !== book.id);
        }
        this.successMessage = `Libro "${book.title}" eliminado de la lista`;
      },
      error: (err: any) => this.errorMessage = 'Error al eliminar libro: ' + err.message
    });
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  isPremiumUser(): boolean {
    return this.currentUser?.subscriptionType === SubscriptionType.Premium;
  }
}