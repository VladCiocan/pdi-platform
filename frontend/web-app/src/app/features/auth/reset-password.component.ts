import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="reset-password-container">
      <mat-card class="reset-card">
        <mat-card-header>
          <mat-card-title>Resetare Parolă</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="!showNewPasswordForm">
            <p>Introduceți adresa de email pentru a primi link-ul de resetare a parolei.</p>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" required>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="sendResetLink()" [disabled]="loading">
              {{ loading ? 'Se trimite...' : 'Trimite Link' }}
            </button>
          </div>
          <div *ngIf="showNewPasswordForm">
            <p>Introduceți noua parolă.</p>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Noua Parolă</mat-label>
              <input matInput type="password" [(ngModel)]="newPassword" required>
              <mat-icon matSuffix>lock</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmare Parolă</mat-label>
              <input matInput type="password" [(ngModel)]="confirmPassword" required>
              <mat-icon matSuffix>lock</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="resetPassword()" [disabled]="loading">
              {{ loading ? 'Se resetează...' : 'Resetează Parola' }}
            </button>
          </div>
          <p *ngIf="message" [class]="messageType">{{ message }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reset-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .reset-card {
      max-width: 400px;
      padding: 20px;
    }
    .full-width { width: 100%; margin-bottom: 16px; }
    .success { color: green; margin-top: 10px; }
    .error { color: red; margin-top: 10px; }
  `]
})
export class ResetPasswordComponent {
  email = '';
  newPassword = '';
  confirmPassword = '';
  token = '';
  showNewPasswordForm = false;
  loading = false;
  message = '';
  messageType = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.showNewPasswordForm = true;
      }
    });
  }

  sendResetLink() {
    this.loading = true;
    this.message = '';
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.message = 'Link-ul de resetare a fost trimis pe email.';
        this.messageType = 'success';
        this.loading = false;
      },
      error: () => {
        this.message = 'Eroare la trimiterea email-ului.';
        this.messageType = 'error';
        this.loading = false;
      }
    });
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Parolele nu se potrivesc.';
      this.messageType = 'error';
      return;
    }
    this.loading = true;
    this.message = '';
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.message = 'Parola a fost resetată cu succes!';
        this.messageType = 'success';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: () => {
        this.message = 'Eroare la resetarea parolei.';
        this.messageType = 'error';
        this.loading = false;
      }
    });
  }
}