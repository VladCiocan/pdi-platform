import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { UserType } from '../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Creează cont nou</mat-card-title>
          <mat-card-subtitle>Înregistrează-te pentru a accesa serviciile online</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nume</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Prenume</mat-label>
                <input matInput formControlName="firstName">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>CNP</mat-label>
              <input matInput formControlName="cnp" maxlength="13">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip cont</mat-label>
              <mat-select formControlName="userType">
                <mat-option value="PERSON">Persoană fizică</mat-option>
                <mat-option value="COMPANY">Persoană juridică</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Parolă</mat-label>
              <input matInput formControlName="password" type="password">
              <mat-hint>Min. 8 caractere</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmare parolă</mat-label>
              <input matInput formControlName="confirmPassword" type="password">
            </mat-form-field>

            @if (error()) {
              <div class="error-message">{{ error() }}</div>
            }

            <button mat-raised-button color="primary" type="submit" class="register-button" [disabled]="loading() || registerForm.invalid">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Înregistrare
              }
            </button>
          </form>

          <div class="login-link">
            <span>Aveți deja cont?</span>
            <a routerLink="/auth/login">Autentificare</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 20px;
    }

    .register-card {
      max-width: 500px;
      width: 100%;
      padding: 24px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      
      mat-form-field {
        flex: 1;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .error-message {
      padding: 12px;
      background: rgba(244, 67, 54, 0.1);
      color: var(--warn-color);
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .register-button {
      width: 100%;
      height: 48px;
      margin-top: 16px;
    }

    .login-link {
      text-align: center;
      margin-top: 24px;
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        margin-left: 8px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cnp: ['', [Validators.required, Validators.minLength(13)]],
      userType: ['PERSON', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { confirmPassword, ...data } = this.registerForm.value;
    if (data.password !== confirmPassword) {
      this.error.set('Parolele nu coincid');
      return;
    }

    this.loading.set(true);
    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], { 
          queryParams: { registered: true } 
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Eroare la înregistrare');
      }
    });
  }
}