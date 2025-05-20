import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../service/category.service';
import { Category } from '../../../models/Category';

@Component({
  selector: 'app-control-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-categorias.component.html',
  styleUrls: ['./control-categorias.component.css']
})
export class ControlCategoriasComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  currentCategory: Category = { id: 0, nombre: '' };
  showForm: boolean = false;
  isEditing: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.map(item => ({
          id: item.id,
          nombre: item.nombre,
          books: []
        }));
        this.filteredCategories = [...this.categories];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar categorías';
        this.isLoading = false;
      }
    });
  }

  updateCategory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.categoryService.updateCategory(this.currentCategory).subscribe({
      next: (updatedCategory) => {
        const index = this.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
          this.categories = [
            ...this.categories.slice(0, index),
            updatedCategory,
            ...this.categories.slice(index + 1)
          ];
          this.filteredCategories = this.searchTerm ? 
            this.categories.filter(category => 
              category.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              category.id.toString().includes(this.searchTerm)
            ) : [...this.categories];
        }
        this.cancelEdit();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar la categoría:', error);
        this.errorMessage = 'Error al actualizar la categoría';
        this.isLoading = false;
      }
    });
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category => 
      category.nombre.toLowerCase().includes(term) ||
      category.id.toString().includes(term)
    );
  }

  showCreateForm(): void {
    this.currentCategory = { id: 0, nombre: '' };
    this.isEditing = false;
    this.showForm = true;
  }

  editCategory(category: Category): void {
    this.currentCategory = { ...category };
    this.isEditing = true;
    this.showForm = true;
  }

  saveCategory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.currentCategory.id = 0;
    
    this.categoryService.saveCategory(this.currentCategory).subscribe({
        next: (savedCategory) => {
            this.categories = [...this.categories, savedCategory];
            this.filteredCategories = [...this.categories];
            this.cancelEdit();
            this.isLoading = false;
        },
        error: (error) => {
            console.error('Error al guardar la categoría:', error);
            this.errorMessage = error.error?.message || 'Error al guardar la categoría';
            this.isLoading = false;
        }
    });
}

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.isLoading = true;
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al eliminar la categoría:', error);
          this.errorMessage = 'Error al eliminar la categoría';
          this.isLoading = false;
        }
      });
    }
  }

  cancelEdit(): void {
    this.showForm = false;
    this.currentCategory = { id: 0, nombre: '' };
    this.isEditing = false;
    this.errorMessage = '';
  }
}