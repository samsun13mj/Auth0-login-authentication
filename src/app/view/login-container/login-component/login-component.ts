import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out'),
      ]),
    ]),
  ],
})
export class LoginComponent {
  isSignup = false;
  showPassword = false;
  form!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    });
  }

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.form.reset();
    this.error = '';
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.form.value;
    this.error = '';

    if (this.isSignup && password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    try {
      if (this.isSignup) {
        await this.authService.signup(email, password);
        alert('✅ Account created successfully! Please sign in.');
        this.isSignup = false;
        this.form.reset();
      } else {
        await this.authService.login(email, password);
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.mapFirebaseError(err?.code);
    }
  }

  mapFirebaseError(code: string) {
    switch (code) {
      case 'auth/user-not-found':
        this.error = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        this.error = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        this.error = 'Email already registered';
        break;
      case 'auth/invalid-email':
        this.error = 'Invalid email address';
        break;
      case 'auth/weak-password':
        this.error = 'Password must be at least 6 characters';
        break;
      default:
        this.error = 'Authentication failed';
    }
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
}
