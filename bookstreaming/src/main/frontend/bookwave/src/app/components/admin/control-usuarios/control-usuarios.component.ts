import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/User';
import { UserSignupRequest } from '../../../models/UserSignupRequest';
import { Role } from '../../../models/Role';
import { SubscriptionType } from '../../../models/SubscriptionType';

@Component({
  selector: 'app-control-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './control-usuarios.component.html',
  styleUrl: './control-usuarios.component.css'
})
export class ControlUsuariosComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  editMode: boolean = false;
  createMode: boolean = false;
  newUser: UserSignupRequest = {
    username: '',
    email: '',
    password: '',
    role: Role.User,
    subscriptionType: SubscriptionType.Free,
    reviews: [],
    readingLists: []
  };
  Role = Role;
  SubscriptionType = SubscriptionType;
  errorMessage: string = '';
  userForm: FormGroup;
  isLoading: boolean = false;


  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: [Role.User],
      subscriptionType: [SubscriptionType.Free],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }

  updateUser(user: User) {
    this.selectedUser = { ...user };
    this.editMode = true;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role,
      subscriptionType: user.subscriptionType
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  showCreateForm() {
    this.createMode = true;
    this.editMode = false;
    this.errorMessage = '';

    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();

    this.userForm.reset({
      role: Role.User,
      subscriptionType: SubscriptionType.Free,
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  createUser() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    if (this.userForm.get('password')?.value !== this.userForm.get('confirmPassword')?.value) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const userData: UserSignupRequest = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      role: this.userForm.value.role,
      subscriptionType: this.userForm.value.subscriptionType,
      reviews: [],
      readingLists: []
    };

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.signup(userData).subscribe({
      next: (user) => {
        this.users.push(user);
        this.cancelCreate();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'El usuario o email ya existe';
        } else {
          this.errorMessage = error.error?.message || 'Error al crear el usuario';
        }
        console.error('Error al crear usuario:', error);
      }
    });
  }

  saveUser() {
    if (!this.selectedUser || !this.userForm.valid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const updateData = {
      username: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      role: this.userForm.get('role')?.value,
      subscriptionType: this.userForm.get('subscriptionType')?.value
    };

    this.userService.updateUser(this.selectedUser.id, updateData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.cancelEdit();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        if (error.status === 409 || (error.error && error.error.message && error.error.message.includes('Duplicate entry'))) {
          this.errorMessage = 'El email o nombre de usuario ya está en uso';
        } else {
          this.errorMessage = 'Error al actualizar el usuario. Por favor, inténtalo de nuevo.';
        }
        this.isLoading = false;
      }
    });
  }

  cancelEdit() {
    this.selectedUser = null;
    this.editMode = false;
    this.errorMessage = '';
    this.userForm.reset();
  }


  cancelCreate() {
    this.createMode = false;
    this.errorMessage = '';
    this.userForm.reset({
      role: Role.User,
      subscriptionType: SubscriptionType.Free
    });
  }

  getPremiumUsers(): number {
    return this.users.filter(user => user.subscriptionType === SubscriptionType.Premium).length;
  }

  getFreeUsers(): number {
    return this.users.filter(user => user.subscriptionType === SubscriptionType.Free).length;
  }

  getAdminUsers(): number {
    return this.users.filter(user => user.role === Role.Admin).length;
  }
}
