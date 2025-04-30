import { Component } from '@angular/core';
import { ButtonCategoryComponent } from '../../category/button-category/button-category.component';
import { LibrosComponent } from '../../category/libros/libros.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../category/search/search.component';

@Component({
  selector: 'app-categories',
  imports: [ButtonCategoryComponent, LibrosComponent, CommonModule, SearchComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  selectedCategoryId: number | 'all' = 'all';
  currentSearchTerm: string = '';

  onCategorySelected(categoryId: number | 'all'): void {
      if (this.selectedCategoryId !== categoryId) {
      this.selectedCategoryId = categoryId;
      this.currentSearchTerm = '';
    }
  }

  onSearch(searchTerm: string): void {
      if (this.currentSearchTerm !== searchTerm) {
      this.currentSearchTerm = searchTerm;
      if (searchTerm) {
        this.selectedCategoryId = 'all';
      }
    }
  }

  getHeaderText(): string {
    if (this.currentSearchTerm) {
      return `Resultados de búsqueda: "${this.currentSearchTerm}"`;
    }
    return this.selectedCategoryId === 'all' ? 'Todos los libros' : 'Libros en esta categoría';
  }
}
