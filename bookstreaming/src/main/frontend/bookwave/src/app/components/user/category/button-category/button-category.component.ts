import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../../../service/category.service';
import { CommonModule } from '@angular/common';
import { Mapa } from '../../../../models/Mapa';

@Component({
  selector: 'app-button-category',
  imports: [CommonModule],
  templateUrl: './button-category.component.html',
  styleUrl: './button-category.component.css'
})
export class ButtonCategoryComponent {
  categories: Mapa[] = [];
  selectedCategory: number | 'all' = 'all';
  @Output() categorySelected = new EventEmitter<number | 'all'>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  selectCategory(categoryId: number | 'all'): void {
    console.log('Category selected:', categoryId);
    this.selectedCategory = categoryId;
    this.categorySelected.emit(categoryId);
  }
}
