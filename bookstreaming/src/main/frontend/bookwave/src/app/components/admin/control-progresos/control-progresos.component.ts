import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadingProgress } from '../../../models/ReadinProgress';
import { ReadingProgressService } from '../../../service/reading-progress.service';

@Component({
  selector: 'app-control-progresos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-progresos.component.html',
  styleUrl: './control-progresos.component.css'
})
export class ControlProgresosComponent implements OnInit {
  readingProgresses: ReadingProgress[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private readingProgressService: ReadingProgressService) {}

  ngOnInit(): void {
    this.loadReadingProgresses();
  }

  loadReadingProgresses(): void {
    this.loading = true;
    this.error = null;
    
    this.readingProgressService.getAllReadingProgress().subscribe({
      next: (progresses) => {
        this.readingProgresses = progresses;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los progresos de lectura';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  deleteProgress(id: number | undefined): void {
    if (id === undefined) {
        this.error = 'Error: ID de progreso no válido';
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este progreso de lectura?')) {
        this.readingProgressService.deleteReadingProgress(id).subscribe({
            next: () => {
                this.readingProgresses = this.readingProgresses.filter(progress => progress.id !== id);
            },
            error: (error) => {
                this.error = 'Error al eliminar el progreso de lectura';
                console.error('Error:', error);
            }
        });
    }
}
}
