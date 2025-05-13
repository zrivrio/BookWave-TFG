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

  updateList(): void {
    if (this.editForm.invalid || !this.selectedList) return;

    const updatedList: ReadingList = {
      ...this.selectedList,
      name: this.editForm.get('name')?.value
    };

    this.loading = true;
    this.libraryService.updateReadingList(updatedList).subscribe({
      next: (list) => {
        const index = this.readingLists.findIndex(l => l.id === list.id);
        if (index !== -1) {
          this.readingLists[index] = list;
        }
        this.success = 'Lista actualizada con éxito';
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
      this.libraryService.deleteReadingListAdmin(list.id).subscribe({
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
}
