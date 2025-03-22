import { Component } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-funcionamiento',
  imports: [CommonModule],
  templateUrl: './funcionamiento.component.html',
  styleUrl: './funcionamiento.component.css'
})
export class FuncionamientoComponent {
  books: Book[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(data => {
      console.log("q")
      this.books = data;
    });
  }
}
