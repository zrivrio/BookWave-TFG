// search.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() searchTermChange = new EventEmitter<string>();
  private searchSubscription?: Subscription;
  
  searchForm = new FormGroup({
    searchTerm: new FormControl('')
  });

  constructor() {
    this.searchSubscription = this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTermChange.emit(value || '');
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSubmit(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    this.searchTermChange.emit(searchTerm || '');
  }

  clearSearch(): void {
    this.searchForm.get('searchTerm')?.setValue('');
  }
}