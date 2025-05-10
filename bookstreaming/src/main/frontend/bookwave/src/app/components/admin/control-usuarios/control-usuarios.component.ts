import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { User } from '../../../models/User';
import { UserSignupRequest } from '../../../models/UserSignupRequest';
import { Role } from '../../../models/Role';
import { SubscriptionType } from '../../../models/SubscriptionType';

@Component({
  selector: 'app-control-usuarios',
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

  constructor(private userService: UserService) {}

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
  }

  errorMessage: string = '';

  createUser() {
    this.errorMessage = '';
    this.userService.signup(this.newUser).subscribe({
      next: (user) => {
        this.users.push(user);
        this.cancelCreate();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        if (error.error && error.error.message && error.error.message.includes('Duplicate entry')) {
          this.errorMessage = 'El email o nombre de usuario ya está en uso';
        } else {
          this.errorMessage = 'Error al crear el usuario. Por favor, inténtalo de nuevo.';
        }
      }
    });
  }

  saveUser() {
    if (this.selectedUser) {
      this.errorMessage = '';
      this.userService.updateUser(this.selectedUser.id, {
        username: this.selectedUser.username,
        email: this.selectedUser.email,
        role: this.selectedUser.role,
        subscriptionType: this.selectedUser.subscriptionType
      }).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          if (error.error && error.error.message && error.error.message.includes('Duplicate entry')) {
            this.errorMessage = 'El email o nombre de usuario ya está en uso';
          } else {
            this.errorMessage = 'Error al actualizar el usuario. Por favor, inténtalo de nuevo.';
          }
        }
      });
    }
  }

  cancelEdit() {
    this.selectedUser = null;
    this.editMode = false;
    this.errorMessage = '';
  }

  cancelCreate() {
    this.createMode = false;
    this.errorMessage = '';
    this.newUser = {
      username: '',
      email: '',
      password: '',
      role: Role.User,
      subscriptionType: SubscriptionType.Free,
      reviews: [],
      readingLists: []
    };
  }

  showCreateForm() {
    this.createMode = true;
  }
}
