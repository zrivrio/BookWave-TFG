import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../../service/book.service';
import { Book } from '../../../../models/Book';

@Component({
  selector: 'app-control-libros',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './control-libros.component.html',
  styleUrl: './control-libros.component.css'
})
export class ControlLibrosComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  newBook: Book = {} as Book;
  isLoading = false;
  isEditing = false;
  error: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
      }
    });
  }

  createBook(): void {
    this.bookService.createBook(this.newBook).subscribe({
      next: (book) => {
        this.books.push(book);
        this.newBook = {} as Book;
        this.error = '';
      },
      error: (error) => {
        this.error = 'Error al crear el libro';
      }
    });
  }

  updateBook(): void {
    if (this.selectedBook && this.selectedBook.id) {
      this.bookService.updateBook(this.selectedBook.id, this.selectedBook).subscribe({
        next: (updatedBook) => {
          const index = this.books.findIndex(b => b.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
          }
          this.selectedBook = null;
          this.isEditing = false;
          this.error = '';
        },
        error: (error) => {
          this.error = 'Error al actualizar el libro';
        }
      });
    }
  }

  deleteBook(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id !== id);
          this.error = '';
        },
        error: (error) => {
          this.error = 'Error al eliminar el libro';
        }
      });
    }
  }

  editBook(book: Book): void {
    this.selectedBook = { ...book };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.selectedBook = null;
    this.isEditing = false;
  }

  getBookValue(field: keyof Book): string {
    if (this.isEditing && this.selectedBook) {
      return (this.selectedBook[field] as string) || '';
    }
    return (this.newBook[field] as string) || '';
  }

  setBookValue(field: keyof Book, value: string): void {
    if (this.isEditing && this.selectedBook) {
      (this.selectedBook as any)[field] = value;
    } else {
      (this.newBook as any)[field] = value;
    }
  }
}
