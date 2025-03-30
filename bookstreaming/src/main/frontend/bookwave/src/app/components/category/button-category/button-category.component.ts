import { Component } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { CommonModule } from '@angular/common';
import { Mapa } from '../../../models/mapa';

@Component({
  selector: 'app-button-category',
  imports: [CommonModule],
  templateUrl: './button-category.component.html',
  styleUrl: './button-category.component.css'
})
export class ButtonCategoryComponent {
  categories: Mapa[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Mapa[]) => {
        this.categories = data;
        },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
}
