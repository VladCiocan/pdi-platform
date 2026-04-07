import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-content>
          <div class="icon-container">
            <mat-icon class="warn-icon">warning_amber</mat-icon>
          </div>
          <h1>Acces Neautorizat</h1>
          <p>Nu aveți permisiunile necesare pentru a accesa această pagină.</p>
          <p class="hint">Dacă credeți că este o eroare, contactați administratorul sistemului.</p>
          <div class="actions">
            <button mat-raised-button color="primary" routerLink="/dashboard">
              <mat-icon>dashboard</mat-icon> Înapoi la Dashboard
            </button>
            <button mat-stroked-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon> Înapoi
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 128px);
      background: #f5f5f5;
    }

    .unauthorized-card {
      max-width: 500px;
      width: 100%;
      padding: 40px;
      text-align: center;
    }

    .icon-container {
      margin-bottom: 24px;
    }

    .warn-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ff9800;
    }

    h1 {
      font-size: 28px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: #333;
    }

    p {
      font-size: 16px;
      color: #666;
      margin: 0 0 8px 0;
    }

    .hint {
      font-size: 13px;
      color: #999;
      margin-bottom: 32px;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .actions button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class UnauthorizedComponent {
  private router = inject(Router);
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
