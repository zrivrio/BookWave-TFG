import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() searchTermChange = new EventEmitter<string>();
  
  searchForm = new FormGroup({
    searchTerm: new FormControl('')
  });

  constructor() {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTermChange.emit(value || '');
      });
  }

  onSubmit(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    this.searchTermChange.emit(searchTerm || '');
  }

  clearSearch(): void {
    this.searchForm.get('searchTerm')?.setValue('');
  }
}
