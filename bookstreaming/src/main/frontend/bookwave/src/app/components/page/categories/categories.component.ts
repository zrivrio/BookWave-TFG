import { Component } from '@angular/core';
import { ButtonCategoryComponent } from '../../category/button-category/button-category.component';
import { LibrosComponent } from '../../category/libros/libros.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [ButtonCategoryComponent, LibrosComponent, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  selectedCategoryId: number | 'all' = 'all';

  onCategorySelected(categoryId: number | 'all'): void {
    this.selectedCategoryId = categoryId;
  }
}
