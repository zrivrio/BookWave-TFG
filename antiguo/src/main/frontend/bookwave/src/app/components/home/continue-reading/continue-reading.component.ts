import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ReadingProgress } from '../../../models/ReadinProgress';
import { ReadingProgressService } from '../../../service/reading-progress-service.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-continue-reading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './continue-reading.component.html',
  styleUrl: './continue-reading.component.css'
})
export class ContinueReadingComponent implements OnInit {
  inProgressBooks: ReadingProgress[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private readingProgressService: ReadingProgressService
  ) {}

  ngOnInit(): void {
    this.loadInProgressBooks();
  }

  private loadInProgressBooks(): void {
    this.isLoading = true;
    this.readingProgressService.getInProgressBooks().subscribe({
      next: (books: ReadingProgress[]) => {
        this.inProgressBooks = books;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.error = 'Failed to load reading progress';
        this.isLoading = false;
        console.error('Error loading reading progress:', err);
      }
    });
  }
}