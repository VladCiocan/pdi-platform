import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="logo-section">
          <img src="assets/logo.svg" alt="Logo" class="logo" (error)="hideLogo($event)">
          <h1>Platforma Digitală Integrată</h1>
          <p class="subtitle">Comuna Nucet, Dâmbovița</p>
        </div>
      </div>

      <div class="login-form-section">
        <mat-card class="login-card">
          <mat-card-header>
            <mat-card-title>Autentificare</mat-card-title>
            <mat-card-subtitle>Introduceți credențialele pentru a accesa platforma</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              @if (requires2FA()) {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Cod 2FA</mat-label>
                  <input matInput formControlName="twoFactorCode" maxlength="6" autocomplete="one-time-code">
                  <mat-icon matSuffix>security</mat-icon>
                </mat-form-field>
              } @else {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" autocomplete="email">
                  <mat-icon matSuffix>email</mat-icon>
                  @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                    <mat-error>Email-ul este obligatoriu</mat-error>
                  }
                  @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                    <mat-error>Introduceți un email valid</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Parolă</mat-label>
                  <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" autocomplete="current-password">
                  <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                    <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                    <mat-error>Parola este obligatorie</mat-error>
                  }
                </mat-form-field>
              }

              <div class="form-options">
                <mat-checkbox formControlName="rememberMe">Ţine-mă minte</mat-checkbox>
                <a routerLink="/auth/forgot-password" class="forgot-link">Am uitat parola</a>
              </div>

              @if (error()) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  <span>{{ error() }}</span>
                </div>
              }

              <button mat-raised-button color="primary" type="submit" class="login-button" [disabled]="loading() || loginForm.invalid">
                @if (loading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  Autentificare
                }
              </button>
            </form>

            <div class="register-link">
              <span>Nu aveți cont?</span>
              <a routerLink="/auth/register">Creează cont</a>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="public-info">
          <p>Acces public: <a routerLink="/">Pagina principală</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
    }

    .login-background {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(21, 101, 192, 0.85);
      }
    }

    .logo-section {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
      padding: 40px;

      .logo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: white;
        padding: 10px;
        margin-bottom: 20px;
      }

      h1 {
        font-size: 32px;
        font-weight: 300;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 18px;
        opacity: 0.9;
      }
    }

    .login-form-section {
      width: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
      background: #fafafa;
    }

    .login-card {
      padding: 24px;

      mat-card-title {
        font-size: 24px;
        margin-bottom: 8px;
      }

      mat-card-subtitle {
        margin-bottom: 24px;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .forgot-link {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 14px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(244, 67, 54, 0.1);
      color: var(--warn-color);
      border-radius: 4px;
      margin-bottom: 16px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      
      mat-spinner {
        margin: 0 auto;
      }
    }

    .register-link {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);

      span {
        color: var(--text-secondary);
      }

      a {
        color: var(--primary-color);
        text-decoration: none;
        margin-left: 8px;
        font-weight: 500;
      }
    }

    .public-info {
      text-align: center;
      margin-top: 24px;
      
      a {
        color: white;
        text-decoration: underline;
      }
    }

    @media (max-width: 900px) {
      .login-background {
        display: none;
      }
      
      .login-form-section {
        width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  hidePassword = signal(true);
  requires2FA = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      twoFactorCode: [''],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password, twoFactorCode } = this.loginForm.value;

    this.authService.login({ email, password, twoFactorCode }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401 && err.error?.requiresTwoFactor) {
          this.requires2FA.set(true);
          this.loginForm.get('twoFactorCode')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.loginForm.get('twoFactorCode')?.updateValueAndValidity();
        } else {
          this.error.set(err.error?.message || 'Email sau parolă incorecte');
        }
      }
    });
  }

  hideLogo(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}