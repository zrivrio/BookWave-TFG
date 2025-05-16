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
  selectedUsers: Set<number> = new Set();

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

  getUniqueUsers() {
    const uniqueUsers = new Map();
    this.readingProgresses.forEach(progress => {
      if (!uniqueUsers.has(progress.user.id)) {
        uniqueUsers.set(progress.user.id, progress.user);
      }
    });
    return Array.from(uniqueUsers.values());
  }

  getUserProgresses(user: any) {
    return this.readingProgresses.filter(progress => progress.user.id === user.id);
  }

  getAverageUserProgress(user: any): number {
    const userProgresses = this.getUserProgresses(user);
    if (userProgresses.length === 0) return 0;
    
    const totalPercentage = userProgresses.reduce((sum, progress) => 
      sum + progress.percentageRead, 0);
    return +(totalPercentage / userProgresses.length).toFixed(1);
  }

  toggleUserProgress(userId: number): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  isUserExpanded(user: any): boolean {
    return this.selectedUsers.has(user.id);
  }

  getProgressClass(percentage: number): string {
    if (percentage >= 75) return 'bg-[#E6F0F7] text-[#0D47A1]'; 
    if (percentage >= 50) return 'bg-[#F5F5F5] text-[#333333]'; 
    if (percentage >= 25) return 'bg-[#EBB2C3] bg-opacity-20 text-[#D81B60]';
    return 'bg-[#F5F5F5] text-[#666666]';
  }
}
