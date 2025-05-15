import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from '../../../service/library.service';
import { ReadingList } from '../../../models/ReadingList';
import { Book } from '../../../models/Book';

@Component({
  selector: 'app-control-listas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './control-listas.component.html',
  styleUrl: './control-listas.component.css'
})
export class ControlListasComponent implements OnInit {
  readingLists: ReadingList[] = [];
  selectedList: ReadingList | null = null;
  selectedUser: any = null;
  expandedUsers: Set<number> = new Set();
  editModeUsers: Set<number> = new Set();
  editForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private libraryService: LibraryService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadAllLists();
  }

  loadAllLists(): void {
    this.loading = true;
    this.libraryService.getAllReadingLists().subscribe({
      next: (lists) => {
        this.readingLists = lists;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las listas de lectura';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectList(list: ReadingList): void {
    this.selectedList = list;
    this.editForm.patchValue({
      name: list.name
    });
  }

  updateList(list: ReadingList): void {
    if (!list) return;

    this.loading = true;
    this.libraryService.updateReadingList(list).subscribe({
      next: (updatedList) => {
        const index = this.readingLists.findIndex(l => l.id === updatedList.id);
        if (index !== -1) {
          this.readingLists[index] = updatedList;
        }
        this.success = 'Lista actualizada correctamente';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteList(list: ReadingList): void {
    if (confirm(`¿Está seguro de que desea eliminar la lista "${list.name}"?`)) {
      this.loading = true;
      this.libraryService.deleteList(list.id, list.user.id).subscribe({
        next: () => {
          this.readingLists = this.readingLists.filter(l => l.id !== list.id);
          if (this.selectedList?.id === list.id) {
            this.selectedList = null;
          }
          this.success = 'Lista eliminada con éxito';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al eliminar la lista';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  removeBookFromList(listId: number, bookId: number): void {
    const list = this.readingLists.find(l => l.id === listId);
    if (!list) return;

    if (confirm('¿Estás seguro de que deseas eliminar este libro de la lista?')) {
      this.loading = true;
      this.libraryService.removeBookFromList(listId, bookId, list.user.id).subscribe({
        next: () => {
          if (list) {
            list.books = list.books.filter(b => b.id !== bookId);
          }
          this.success = 'Libro eliminado de la lista correctamente';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al eliminar el libro de la lista';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  getUsersWithLists(): any[] {
    const usersMap = new Map();
    this.readingLists.forEach(list => {
      if (list.user && !usersMap.has(list.user.id)) {
        usersMap.set(list.user.id, list.user);
      }
    });
    return Array.from(usersMap.values());
  }

  getUserLists(user: any): ReadingList[] {
    return this.readingLists.filter(list => list.user.id === user.id);
  }

  getTotalBooksInLists(user: any): number {
    return this.getUserLists(user).reduce((total, list) => total + (list.books?.length || 0), 0);
  }

  toggleUserLists(user: any): void {
    if (this.isUserExpanded(user)) {
      this.expandedUsers.delete(user.id);
      this.selectedUser = null;
    } else {
      this.expandedUsers.add(user.id);
      this.selectedUser = user;
    }
  }

  isUserExpanded(user: any): boolean {
    return this.expandedUsers.has(user.id);
  }

  getUserSubscriptionType(user: any): string {
    return user.subscription?.type || 'free';
  }

  isUserAtListLimit(user: any): boolean {
    const userLists = this.getUserLists(user);
    return this.getUserSubscriptionType(user) === 'free' && userLists.length >= 5;
  }

  isListAtBookLimit(list: ReadingList): boolean {
    if (this.getUserSubscriptionType(list.user) === 'free') {
      return (list.books?.length || 0) >= 10;
    }
    return false;
  }

  toggleEditMode(user: any): void {
    if (this.isUserInEditMode(user)) {
      this.editModeUsers.delete(user.id);
    } else {
      this.editModeUsers.add(user.id);
    }
  }

  isUserInEditMode(user: any): boolean {
    return this.editModeUsers.has(user.id);
  }
}
