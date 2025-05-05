import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpService } from '../../../../service/help.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-help-p',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './help-p.component.html',
  styleUrl: './help-p.component.css'
})
export class HelpPComponent {
  helpForm: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  activeFAQ: number | null = null;

  constructor(
    private fb: FormBuilder,
    private helpService: HelpService,
    private authService: AuthService
  ) {
    this.helpForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Enviar formulario
  onSubmit() {
    if (this.helpForm.invalid) return;

    this.isSubmitting = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      console.error('No hay usuario autenticado');
      this.isSubmitting = false;
      return;
    }

    const formData = {
      ...this.helpForm.value,
      user: {
        id: currentUser.id
      },
      createdAt: new Date().toISOString()
    };

    this.helpService.sendHelpRequest(formData).subscribe({
      next: () => {
        this.isSuccess = true;
        this.helpForm.reset();
        setTimeout(() => this.isSuccess = false, 5000);
      },
      error: (err) => {
        console.error('Error al enviar:', err);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // Mostrar/ocultar FAQs
  toggleFAQ(id: number) {
    this.activeFAQ = this.activeFAQ === id ? null : id;
  }
}
