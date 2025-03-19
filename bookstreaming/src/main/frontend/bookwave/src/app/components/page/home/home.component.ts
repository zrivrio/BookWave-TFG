import { Component } from '@angular/core';
import { NewBookComponent } from "../../home/new-book/new-book.component";
import { ContinueReadingComponent } from "../../home/continue-reading/continue-reading.component";
import { RecommendedBooksComponent } from "../../home/recommended-books/recommended-books.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NewBookComponent, ContinueReadingComponent, RecommendedBooksComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
     // Libros para continuar leyendo
  continueReadingBooks = [
    {
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      cover: 'https://via.placeholder.com/80x120?text=Libro+1',
      progress: 45,
    },
    {
      title: '1984',
      author: 'George Orwell',
      cover: 'https://via.placeholder.com/80x120?text=Libro+2',
      progress: 60,
    },
    {
      title: 'Don Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      cover: 'https://via.placeholder.com/80x120?text=Libro+3',
      progress: 30,
    },
  ];

  // Libro destacado
  featuredBook = {
    title: 'El Alquimista',
    author: 'Paulo Coelho',
    description: 'Un viaje lleno de enseñanzas y autoconocimiento.',
    cover: 'https://via.placeholder.com/200x300?text=Libro+Destacado',
  };

  // Libros recomendados
  recommendedBooks = [
    {
      title: 'La sombra del viento',
      author: 'Carlos Ruiz Zafón',
      cover: 'https://via.placeholder.com/120x180?text=Recomendado+1',
    },
    {
      title: 'El nombre del viento',
      author: 'Patrick Rothfuss',
      cover: 'https://via.placeholder.com/120x180?text=Recomendado+2',
    },
    {
      title: 'Los pilares de la Tierra',
      author: 'Ken Follett',
      cover: 'https://via.placeholder.com/120x180?text=Recomendado+3',
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      cover: 'https://via.placeholder.com/120x180?text=Recomendado+4',
    },
  ];
}
