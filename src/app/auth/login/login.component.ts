import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../auth.service';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

export interface AppMessage {
  severity?: 'success' | 'info' | 'warn' | 'error';
  summary?: string;
  detail?: string;
}
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    RippleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm!: FormGroup;
  loading = false;
  messages: AppMessage[] = [];


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.messages = [];

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
          this.loading = false;
          this.router.navigate(['/features/home']); // Navigate to your main app
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'error.error?.message' });
          this.messages = [{
            severity: 'error',
            summary: 'Login Failed',
            detail: error.error?.message || 'Invalid credentials'
          }];
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onForgotPassword(): void {
    // Implement forgot password functionality
    console.log('Forgot password clicked');
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
