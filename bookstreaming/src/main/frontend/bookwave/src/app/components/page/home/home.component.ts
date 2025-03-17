import { Component } from '@angular/core';
import { NewBookComponent } from "../../home/new-book/new-book.component";
import { ContinueReadingComponent } from "../../home/continue-reading/continue-reading.component";
import { RecommendedBooksComponent } from "../../home/recommended-books/recommended-books.component";

@Component({
  selector: 'app-home',
  imports: [NewBookComponent, ContinueReadingComponent, RecommendedBooksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  featuredBook = {
    title: 'El Nombre del Viento',
    description: 'Una fascinante historia de Kvothe...',
    image: 'assets/books/elnombredelviento.jpg'
  };

  continueReadingBooks = [
    { title: '1984', category: 'Distopía', image: 'assets/books/1984.jpg', progress: 60 },
    { title: 'Dune', category: 'Sci-fi', image: 'assets/books/dune.jpg', progress: 20 }
  ];

  recommendedBooks = [
    { title: 'El Alquimista', category: 'Ficción', image: 'assets/books/alquimista.jpg' },
    { title: 'Sapiens', category: 'Historia', image: 'assets/books/sapiens.jpg' },
    { title: 'Harry Potter', category: 'Fantasía', image: 'assets/books/harrypotter.jpg' }
  ];
}
