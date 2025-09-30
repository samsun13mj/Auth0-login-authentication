import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth-service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss']
})
export class LoginComponent {
  hidePassword = true;
  form: any;   

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  async login() {
    const { email, password } = this.form.value;
    if (email && password) {
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    }
  }

  async signup() {
    const { email, password } = this.form.value;
    if (email && password) {
      await this.authService.signup(email, password);
      this.router.navigate(['/dashboard']);
    }
  }
}
