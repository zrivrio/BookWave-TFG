import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/Book';

@Component({
  selector: 'app-control-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-libros.component.html',
  styleUrls: ['./control-libros.component.css']
})
export class ControlLibrosComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  currentYear = new Date().getFullYear();
  currentBook: Partial<Book> = {
    title: '',
    author: '',
    description: '',
    cover: '',
    language: 'es',
    year: this.currentYear,
    totalPages: undefined
  };
  isLoading = false;
  isEditing = false;
  showForm = false;
  error: string | null = null;
  searchTerm = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = [...books];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  filterBooks(): void {
    if (!this.searchTerm) {
      this.filteredBooks = [...this.books];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      (book.description && book.description.toLowerCase().includes(term)) ||
      (book.language && this.getLanguageName(book.language).toLowerCase().includes(term)) ||
      book.year.toString().includes(term));
  }

  showCreateForm(): void {
    this.currentBook = {
      title: '',
      author: '',
      description: '',
      cover: '',
      language: 'es',
      year: this.currentYear,
      totalPages: undefined
    };
    this.isEditing = false;
    this.showForm = true;
  }

  createBook(): void {
    if (!this.validateBookFields()) return;

    this.bookService.createBook(this.currentBook as Book).subscribe({
      next: (book) => {
        this.books.push(book);
        this.filterBooks();
        this.showForm = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al crear el libro';
        console.error(error);
      }
    });
  }

  updateBook(): void {
    if (!this.currentBook.id || !this.validateBookFields()) return;

    this.bookService.updateBook(this.currentBook.id, this.currentBook as Book).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
        }
        this.filterBooks();
        this.showForm = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al actualizar el libro';
        console.error(error);
      }
    });
  }

 deleteBook(id: number): void {
  if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
    console.log('Intentando eliminar libro con ID:', id);
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        console.log('Libro eliminado exitosamente');
        this.books = this.books.filter(b => b.id !== id);
        this.filterBooks();
        this.error = null;
      },
      error: (error) => {
        console.error('Error al eliminar libro:', error);
        this.error = 'Error al eliminar el libro';
      }
    });
  }
}

  editBook(book: Book): void {
    this.currentBook = { ...book };
    this.isEditing = true;
    this.showForm = true;
  }

  cancelEdit(): void {
    this.showForm = false;
  }

  validateBookFields(): boolean {
    if (!this.currentBook.title || !this.currentBook.author || !this.currentBook.language || !this.currentBook.year) {
      this.error = 'Título, autor, idioma y año son campos obligatorios';
      return false;
    }
    return true;
  }

  getLanguageName(code: string = 'es'): string {
    const languages: {[key: string]: string} = {
      'es': 'Español',
      'en': 'Inglés',
      'fr': 'Francés',
      'de': 'Alemán',
      'it': 'Italiano'
    };
    return languages[code] || code;
  }
}
