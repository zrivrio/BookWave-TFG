// add-to-reading-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ReadingList } from '../../models/ReadingList';
import { LibraryService } from '../../service/library.service';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-to-reading-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-to-reading-list.component.html',
  styleUrls: ['./add-to-reading-list.component.scss']
})
export class AddToReadingListComponent implements OnInit {
  @Input() bookId!: number;
  
  readingLists: ReadingList[] = [];
  selectedListId: number | null = null;
  loading = false;
  error = '';
  success = '';
  userId: number | null = null;
  showModal = false;
  newListForm: FormGroup;
  showDropdown = false;

  constructor(
    private readingListService: LibraryService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.newListForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    this.userId = user?.id || null;
    if (this.userId) {
      this.loadUserLists();
    }
  }

  loadUserLists(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.readingListService.getLists(this.userId).subscribe({
      next: (lists: ReadingList[]) => {
        this.readingLists = lists;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar las listas de lectura';
        this.loading = false;
        console.error(err);
      }
    });
  }

 // Actualiza el método addToList
addToList(listId?: number): void {
  const targetListId = listId || this.selectedListId;
  
  if (!this.userId || !targetListId || !this.bookId) {
      this.error = 'Selecciona una lista para añadir el libro';
      return;
  }
  
  this.loading = true;
  this.error = '';
  this.success = '';
  
  this.readingListService.addBookToList(targetListId, this.bookId, this.userId).subscribe({
      next: () => {
          this.success = 'Libro añadido a la lista con éxito';
          this.loading = false;
          this.selectedListId = null;
          setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
          this.error = err.error?.message || err.message || 'Error al añadir el libro a la lista';
          this.loading = false;
          console.error(err);
      }
  });
}

  createNewList(): void {
    if (this.newListForm.invalid || !this.userId) return;
    
    const name = this.newListForm.get('name')?.value;
    this.loading = true;
    
    this.readingListService.createList(this.userId, name).subscribe({
      next: (list: ReadingList) => {
        this.readingLists.push(list);
        this.newListForm.reset();
        this.success = 'Lista creada con éxito';
        this.loading = false;
        this.showModal = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Error al crear la lista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleDropdown(): void {
    if (this.readingLists.length > 0) {
      this.showDropdown = !this.showDropdown;
    }
  }

  openModal(): void {
    this.showModal = true;
    this.newListForm.reset();
    this.error = '';
    this.showDropdown = false;
  }

  closeModal(): void {
    this.showModal = false;
  }
}