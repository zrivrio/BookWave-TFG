import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReadingList } from '../../../models/ReadingList';
import { LibraryService } from '../../../service/library.service';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-add-to-reading-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-to-reading-list.component.html',
  styleUrls: ['./add-to-reading-list.component.scss']
})
export class AddToReadingListComponent implements OnInit, OnDestroy {
  @Input() bookId!: number;
  
  readingLists: ReadingList[] = [];
  loading = false;
  error = '';
  success = '';
  showModal = false;
  showDropdown = false;
  newListForm: FormGroup;
  currentUserId: number | null = null;
  
  private destroy$ = new Subject<void>();

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
    // Suscribirse a cambios de usuario con filtros para evitar llamadas innecesarias
    this.userService.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => {
          // Solo recargar si el usuario realmente cambió
          const prevId = prev?.id || null;
          const currId = curr?.id || null;
          return prevId === currId;
        })
      )
      .subscribe(user => {
        console.log('Usuario cambió:', user);
        this.currentUserId = user?.id || null;
        
        if (user?.id) {
          this.loadUserLists(user.id);
        } else {
          this.readingLists = [];
          this.resetState();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserLists(userId: number): void {
    if (this.loading) return; // Evitar llamadas múltiples
    
    console.log('Cargando listas para usuario:', userId);
    this.loading = true;
    this.error = '';
    
    this.readingListService.getLists(userId).subscribe({
      next: (lists: ReadingList[]) => {
        console.log('Listas cargadas:', lists);
        this.readingLists = lists || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando listas:', err);
        this.error = 'Error al cargar las listas de lectura';
        this.readingLists = [];
        this.loading = false;
      }
    });
  }

  addToList(listId: number): void {
    if (!this.currentUserId || !this.bookId || this.loading) {
      console.error('Faltan datos:', { userId: this.currentUserId, bookId: this.bookId, loading: this.loading });
      return;
    }
    
    console.log('Añadiendo libro a lista:', { listId, bookId: this.bookId, userId: this.currentUserId });
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.readingListService.addBookToList(listId, this.bookId, this.currentUserId).subscribe({
      next: () => {
        console.log('Libro añadido exitosamente');
        this.success = 'Libro añadido a la lista con éxito';
        this.loading = false;
        this.showDropdown = false;
        
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error añadiendo libro:', err);
        this.error = err.error?.message || 'Error al añadir el libro a la lista';
        this.loading = false;
        
        setTimeout(() => {
          this.error = '';
        }, 5000);
      }
    });
  }

  createNewList(): void {
    if (this.newListForm.invalid || !this.currentUserId || this.loading) {
      return;
    }
    
    const name = this.newListForm.get('name')?.value;
    console.log('Creando nueva lista:', name);
    
    this.loading = true;
    this.error = '';
    
    this.readingListService.createList(this.currentUserId, name).subscribe({
      next: (list: ReadingList) => {
        console.log('Lista creada:', list);
        this.readingLists.push(list);
        this.newListForm.reset();
        this.success = 'Lista creada con éxito';
        this.loading = false;
        this.showModal = false;
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error creando lista:', err);
        this.error = err.error?.message || 'Error al crear la lista';
        this.loading = false;
        
        setTimeout(() => {
          this.error = '';
        }, 5000);
      }
    });
  }

  private resetState(): void {
    this.loading = false;
    this.error = '';
    this.success = '';
    this.showModal = false;
    this.showDropdown = false;
    this.newListForm.reset();
  }

  toggleDropdown(): void {
    if (!this.currentUserId) {
      this.error = 'Debes iniciar sesión para añadir libros a listas';
      return;
    }
    
    if (this.readingLists.length > 0) {
      this.showDropdown = !this.showDropdown;
    } else {
      this.openModal();
    }
  }

  openModal(): void {
    if (!this.currentUserId) {
      this.error = 'Debes iniciar sesión para crear listas';
      return;
    }
    
    this.showModal = true;
    this.newListForm.reset();
    this.error = '';
    this.showDropdown = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.newListForm.reset();
    this.error = '';
  }
}