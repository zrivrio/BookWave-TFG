import { Component } from '@angular/core';
import {BookService} from '../../service/book.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  standalone: true,
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  libros: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.obtenerLibros().subscribe((data) => {
      this.libros = data;
    });
  }

}
