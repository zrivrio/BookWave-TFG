import { Component } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-category',
  imports: [CommonModule],
  templateUrl: './button-category.component.html',
  styleUrl: './button-category.component.css'
})
export class ButtonCategoryComponent {
  categories: String[] = [];

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
}
