import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../service/auth.service';
import { UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  editForm: FormGroup;
  currentUser: any;
  isLoading = true;
  isUpdating = false;
  updateSuccess = false;
  updateError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.editForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email
      });
    }
    this.isLoading = false;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.editForm.invalid) return;

    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = null;

    const formData = this.editForm.value;
    const updateData: any = {
      username: formData.username,
      email: formData.email
    };

    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    this.userService.updateUser(this.currentUser.id, updateData).subscribe({
      next: (updatedUser) => {
        this.authService.setCurrentUser(updatedUser);
        this.updateSuccess = true;
        this.isUpdating = false;
        setTimeout(() => this.updateSuccess = false, 3000);
      },
      error: (error) => {
        this.updateError = error.error?.message || 'Error al actualizar el perfil';
        this.isUpdating = false;
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
