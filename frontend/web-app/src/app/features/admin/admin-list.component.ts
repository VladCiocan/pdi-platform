import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  systemUptime: string;
  pendingRequests: number;
}

interface AdminLink {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1><mat-icon>admin_panel_settings</mat-icon> Panou Administrare</h1>
        <p>Gestionare utilizatori, setari si monitorizare sistem</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #1976d2;">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">Utilizatori Total</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #4caf50;">
              <mat-icon>online_prediction</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.activeSessions }}</div>
              <div class="stat-label">Sesiuni Active</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>timer</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.systemUptime }}</div>
              <div class="stat-label">Uptime Sistem</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #f44336;">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingRequests }}</div>
              <div class="stat-label">Cereri in Asteptare</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Navigation Cards -->
      <h2 class="section-title">Module Administrare</h2>
      <div class="admin-grid">
        @for (link of adminLinks; track link.route) {
          <mat-card class="admin-card" [routerLink]="link.route">
            <mat-card-content>
              <div class="card-icon" [style.background]="link.color">
                <mat-icon>{{ link.icon }}</mat-icon>
              </div>
              <h3>{{ link.title }}</h3>
              <p>{{ link.description }}</p>
              <button mat-stroked-button color="primary" class="card-action">
                <mat-icon>arrow_forward</mat-icon> Deschide
              </button>
            </mat-card-content>
          </mat-card>
        }
      </div>

      @if (loading) {
        <div class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }
    </div>
  `,
  styles: [`
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .page-header p {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .section-title {
      margin: 32px 0 16px;
      font-size: 20px;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px !important;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 24px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .admin-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .admin-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }

    .admin-card mat-card-content {
      padding: 24px !important;
      text-align: center;
    }

    .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 0 auto 16px;
    }

    .card-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .admin-card h3 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }

    .admin-card p {
      color: var(--text-secondary);
      margin: 0 0 16px;
      font-size: 14px;
    }

    .card-action {
      width: 100%;
    }

    .loading-overlay {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .admin-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminListComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  loading = false;

  stats: AdminStats = {
    totalUsers: 0,
    activeSessions: 0,
    systemUptime: '-',
    pendingRequests: 0
  };

  adminLinks: AdminLink[] = [
    {
      title: 'Gestionare Utilizatori',
      description: 'Adaugati, editati si gestionati conturile utilizatorilor din sistem.',
      icon: 'group',
      route: '/admin/users',
      color: '#1976d2'
    },
    {
      title: 'Setari Sistem',
      description: 'Configurati parametrii sistemului, notificari si securitate.',
      icon: 'settings',
      route: '/admin/settings',
      color: '#ff9800'
    },
    {
      title: 'Loguri Sistem',
      description: 'Vizualizati jurnalele de activitate si evenimentele din sistem.',
      icon: 'receipt_long',
      route: '/admin/logs',
      color: '#9c27b0'
    },
    {
      title: 'Rapoarte',
      description: 'Generati si descarcati rapoarte privind activitatea platformei.',
      icon: 'assessment',
      route: '/admin/reports',
      color: '#4caf50'
    }
  ];

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.http.get<AdminStats>(`${environment.authUrl}/stats`).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la incarcarea datelor', 'Inchide', { duration: 3000 });
        return of({ totalUsers: 0, activeSessions: 0, systemUptime: '-', pendingRequests: 0 } as AdminStats);
      })
    ).subscribe((data) => {
      this.stats = data;
      this.loading = false;
    });
  }
}
