import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../service/book.service';
import { Book } from '../../../models/Book';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  book: Book | undefined;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.loadBookDetails();
  }

  loadBookDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.bookService.getBookById(+id).subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles del libro';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'ID de libro no proporcionado';
      this.loading = false;
    }
  }
}
