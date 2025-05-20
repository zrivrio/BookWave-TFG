import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HelpService } from '../../../service/help.service';
import { Help } from '../../../models/Help';
import { HelpStatus } from '../../../models/HelpStatus';

@Component({
  selector: 'app-panel-control',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './panel-control.component.html',
  styleUrl: './panel-control.component.css'
})
export class PanelControlComponent implements OnInit {
  helpRequests: Help[] = [];
  loading = false;
  error = '';
  HelpStatus = HelpStatus;

  constructor(private helpService: HelpService) {}

  ngOnInit() {
    this.loadHelpRequests();
  }

  loadHelpRequests() {
    this.loading = true;
    this.helpService.getAllHelpRequests().subscribe({
      next: (requests) => {
        this.helpRequests = requests.map(request => ({
          ...request,
          status: request.status || HelpStatus.PENDING
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las solicitudes de ayuda';
        this.loading = false;
      }
    });
  }

  updateHelpStatus(request: Help, newStatus: HelpStatus) {
    const updatedRequest = { 
      ...request, 
      status: newStatus,
      updatedAt: new Date() 
    };

    this.helpService.updateHelpRequest(updatedRequest).subscribe({
      next: () => {
        const index = this.helpRequests.findIndex(r => r.id === request.id);
        if (index !== -1) {
          this.helpRequests[index] = updatedRequest;
        }
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado';
      }
    });
  }

  getStatusRequests(status: HelpStatus): Help[] {
    return this.helpRequests.filter(request => request.status === status);
  }

  getStatusClass(status: HelpStatus): string {
    switch(status) {
      case HelpStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700';
      case HelpStatus.RESOLVED:
        return 'bg-green-100 text-green-700';
      case HelpStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      default: 
        return 'bg-[#E6F0F7] text-[#1E0f75]';
    }
  }

  getButtonText(status: HelpStatus): string {
    switch(status) {
      case HelpStatus.PENDING:
        return 'Marcar En Proceso';
      case HelpStatus.IN_PROGRESS:
        return 'Marcar Completado';
      case HelpStatus.RESOLVED:
        return 'Reabrir';
      case HelpStatus.CANCELLED:
        return 'Reabrir';
      default:
        return 'Cambiar Estado';
    }
  }
}