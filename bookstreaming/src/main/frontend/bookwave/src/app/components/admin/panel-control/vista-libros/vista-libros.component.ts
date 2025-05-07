import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../../service/book.service';
import { Book } from '../../../../models/Book';

@Component({
  selector: 'app-vista-libros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vista-libros.component.html',
  styleUrl: './vista-libros.component.css'
})
export class VistaLibrosComponent implements OnInit {
  books: Book[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books.slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los libros';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  editBook(book: Book): void {
    // Redirigir a la página de control-libros con el ID del libro
    window.location.href = `/admin/control-libros?edit=${book.id}`;
  }

  deleteBook(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id !== id);
        },
        error: (error) => {
          this.error = 'Error al eliminar el libro';
          console.error(error);
        }
      });
    }
  }
}
