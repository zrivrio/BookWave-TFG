import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReadingList } from '../../../models/ReadingList';
import { LibraryService } from '../../../service/library.service';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-to-reading-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-to-reading-list.component.html',
  styleUrls: ['./add-to-reading-list.component.scss']
})
export class AddToReadingListComponent implements OnInit, OnDestroy {
  @Input() bookId!: number;
  @Input() bookTitle?: string; 
  
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
    private fb: FormBuilder,
  ) {
    this.newListForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.setupUserSubscription();
    this.setupFormChanges();
  }

  private setupUserSubscription(): void {
    this.userService.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id)
      )
      .subscribe(user => {
        this.currentUserId = user?.id || null;
        
        if (user?.id) {
          this.loadUserLists(user.id);
        } else {
          this.readingLists = [];
          this.resetState();
        }
      });
  }

  private setupFormChanges(): void {
    this.newListForm.get('name')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(150)
      )
      .subscribe(() => {
        this.error = '';
      });
  }

  loadUserLists(userId: number): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';
    
    this.readingListService.getLists(userId).subscribe({
      next: (lists: ReadingList[]) => {
        this.readingLists = lists || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading lists:', err);
        this.error = 'Error loading reading lists';
        this.readingLists = [];
        this.loading = false;
      }
    });
  }

  addToList(listId: number): void {
    if (!this.currentUserId || !this.bookId || this.loading) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.readingListService.addBookToList(listId, this.bookId, this.currentUserId).subscribe({
      next: () => {
        const listName = this.readingLists.find(l => l.id === listId)?.name || 'the list';
        this.success = `"${this.bookTitle || 'Book'}" added to ${listName}`;
        this.loading = false;
        this.showDropdown = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error adding book to list';
        this.loading = false;
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  createNewList(): void {
    if (this.newListForm.invalid || !this.currentUserId || this.loading) {
      return;
    }
    
    const name = this.newListForm.get('name')?.value;
    
    this.loading = true;
    this.error = '';
    
    this.readingListService.createList(this.currentUserId, name).subscribe({
      next: (list: ReadingList) => {
        this.readingLists.push(list);
        this.newListForm.reset();
        this.success = `List "${name}" created successfully`;
        this.loading = false;
        this.showModal = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Error creating list';
        this.loading = false;
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  toggleDropdown(): void {
    if (!this.currentUserId) {
      this.error = 'You must log in to add books to lists';
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
      this.error = 'You must log in to create lists';
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

  private resetState(): void {
    this.loading = false;
    this.error = '';
    this.success = '';
    this.showModal = false;
    this.showDropdown = false;
    this.newListForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}