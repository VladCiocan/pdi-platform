import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="forgot-container">
      <mat-card class="forgot-card">
        <mat-card-header>
          <mat-card-title>Resetare parolă</mat-card-title>
          <mat-card-subtitle>Introduceți email-ul pentru a primi link-ul de resetare</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (!emailSent()) {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email">
              </mat-form-field>

              @if (error()) {
                <div class="error-message">{{ error() }}</div>
              }

              <button mat-raised-button color="primary" type="submit" class="submit-button" [disabled]="loading() || form.invalid">
                @if (loading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Trimite email
                }
              </button>
            </form>
          } @else {
            <div class="success-message">
              <mat-icon>check_circle</mat-icon>
              <p>Am trimis un email cu instrucțiuni la adresa dumneavoastră.</p>
              <p>Verificați și folderul SPAM.</p>
            </div>
          }

          <div class="back-link">
            <a routerLink="/auth/login">Înapoi la autentificare</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 20px;
    }

    .forgot-card {
      max-width: 400px;
      width: 100%;
      padding: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .error-message {
      padding: 12px;
      background: rgba(244, 67, 54, 0.1);
      color: var(--warn-color);
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .success-message {
      text-align: center;
      padding: 20px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--success-color);
      }

      p {
        margin: 8px 0;
        color: var(--text-secondary);
      }
    }

    .submit-button {
      width: 100%;
      height: 48px;
    }

    .back-link {
      text-align: center;
      margin-top: 24px;

      a {
        color: var(--primary-color);
        text-decoration: none;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  emailSent = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.authService.requestPasswordReset(this.form.value.email).subscribe({
      next: () => {
        this.emailSent.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Eroare la trimiterea email-ului');
        this.loading.set(false);
      }
    });
  }
}