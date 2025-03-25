import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { Role } from '../../../models/Role';
import { SubscriptionType } from '../../../models/SubscriptionType';
import { HttpClientModule } from '@angular/common/http';
import { UserSignupRequest } from '../../../models/UserSignupRequest';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password');
    const confirmPassword = g.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  onSignup(): void {
    if (this.signupForm.invalid) return;
      
    this.isLoading = true;
    this.errorMessage = '';
  
    const userData: UserSignupRequest = {
        username: this.signupForm.get('username')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value,
        role: Role.User,
        subscriptionType: SubscriptionType.Free,
        reviews: [],
        readingLists: []
    };
  
    this.userService.signup(userData).subscribe({
      next: (user) => {
        console.log('Signup successful');
        // Remove automatic login and redirect to login page instead
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        if (error.status === 409) {
          this.errorMessage = 'Username or email already exists';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        this.isLoading = false;
      }
    });
}

  // Form control getters
  get username() { return this.signupForm.get('username'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}