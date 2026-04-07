import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { TaxService } from '../../core/services/tax.service';
import { TaxLiability } from '../../core/models';
import { catchError, of } from 'rxjs';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1>Bine ai venit, {{ userName() }}!</h1>
        <p>Aici ai o vedere de ansamblu asupra contului și serviciilor tale.</p>
      </div>

      <div class="card-grid">
        @for (card of cards(); track card.title) {
          <div class="dashboard-card" [style.border-left]="'4px solid ' + card.color">
            <h3>{{ card.title }}</h3>
            <div class="value">{{ card.value }}</div>
            @if (card.subtitle) {
              <div class="subtitle">{{ card.subtitle }}</div>
            }
          </div>
        }
      </div>

      <div class="dashboard-sections">
        <mat-card class="quick-actions">
          <mat-card-header>
            <mat-card-title>Acțiuni rapide</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="actions-grid">
              <button mat-stroked-button routerLink="/taxes">
                <mat-icon>payment</mat-icon>
                Plătește taxele
              </button>
              <button mat-stroked-button routerLink="/taxes">
                <mat-icon>description</mat-icon>
                Depune declarație
              </button>
              <button mat-stroked-button routerLink="/dms">
                <mat-icon>folder_open</mat-icon>
                Documente
              </button>
              <button mat-stroked-button routerLink="/agriculture">
                <mat-icon>agriculture</mat-icon>
                Registru agricol
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="recent-liabilities">
          <mat-card-header>
            <mat-card-title>Obligații de plată</mat-card-title>
            <button mat-button color="primary" routerLink="/taxes">Vezi toate</button>
          </mat-card-header>
          <mat-card-content>
            @if (recentLiabilities().length === 0) {
              <div class="empty-state">
                <mat-icon>check_circle</mat-icon>
                <p>Nu aveți obligații de plată restante.</p>
              </div>
            } @else {
              <table mat-table [dataSource]="recentLiabilities()" class="liabilities-table">
                <ng-container matColumnDef="year">
                  <th mat-header-cell *matHeaderCellDef>An</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.year }}</td>
                </ng-container>

                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Suma</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.totalDue }} RON</td>
                </ng-container>

                <ng-container matColumnDef="dueDate">
                  <th mat-header-cell *matHeaderCellDef>Scadență</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.dueDate | date:'dd/MM/yyyy' }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let liab">
                    <span class="status-badge" [ngClass]="'status-' + liab.status?.toLowerCase()">
                      {{ getStatusLabel(liab.status) }}
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
      margin-top: 24px;
    }

    .quick-actions mat-card-content {
      padding-top: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      button {
        height: 80px;
        flex-direction: column;

        mat-icon {
          margin-bottom: 8px;
        }
      }
    }

    .liabilities-table {
      width: 100%;
    }

    .recent-liabilities mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #4caf50;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      p {
        margin-top: 8px;
        color: #666;
      }
    }

    @media (max-width: 1024px) {
      .dashboard-sections {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  cards = signal<DashboardCard[]>([]);
  recentLiabilities = signal<TaxLiability[]>([]);
  displayedColumns = ['year', 'amount', 'dueDate', 'status'];

  private snackBar: MatSnackBar;

  constructor(
    private authService: AuthService,
    private taxService: TaxService,
    snackBar: MatSnackBar
  ) {
    this.snackBar = snackBar;
  }

  ngOnInit(): void {
    this.loadData();
  }

  userName(): string {
    const user = this.authService.currentUser();
    return user?.firstName || 'Utilizator';
  }

  loadData(): void {
    // Set initial cards
    this.cards.set([
      { title: 'Total de plată', value: 'Se încarcă...', icon: 'account_balance_wallet', color: '#f44336', subtitle: 'obligații' },
      { title: 'Proprietăți', value: 'Se încarcă...', icon: 'home', color: '#2196f3', subtitle: 'înregistrate' },
      { title: 'Plăți anul curent', value: 'Se încarcă...', icon: 'payments', color: '#4caf50', subtitle: 'efectuate' },
      { title: 'Documente', value: 'Se încarcă...', icon: 'folder', color: '#ff9800', subtitle: 'în sistem' }
    ]);

    // Load tax liabilities
    this.taxService.getLiabilities().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([]); })
    ).subscribe(liabilities => {
      const items = Array.isArray(liabilities) ? liabilities : (liabilities as any)?.content || [];
      this.recentLiabilities.set(items.slice(0, 5));

      const totalDue = items.filter((l: any) => l.status !== 'PAID').reduce((sum: number, l: any) => sum + (l.totalDue || l.remainingAmount || 0), 0);
      const paidCount = items.filter((l: any) => l.status === 'PAID').length;

      this.updateCard(0, totalDue > 0 ? totalDue.toFixed(2) + ' RON' : 'Nimic de plată', totalDue > 0 ? 'restante' : '');
      this.updateCard(2, paidCount, 'efectuate');
    });

    // Load properties count
    this.taxService.getProperties().pipe(
      catchError(() => of([]))
    ).subscribe(props => {
      const items = Array.isArray(props) ? props : (props as any)?.content || [];
      this.updateCard(1, items.length, 'înregistrate');
    });

    // Load documents count
    this.updateCard(3, '-', 'disponibile');
  }

  private updateCard(index: number, value: string | number, subtitle?: string): void {
    const current = this.cards();
    const updated = [...current];
    updated[index] = { ...updated[index], value, subtitle: subtitle || updated[index].subtitle };
    this.cards.set(updated);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Inchide', { duration: 3000 });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Neachitat',
      PARTIAL: 'Parțial',
      PAID: 'Achitat',
      OVERDUE: 'Restant',
      ENFORCED: 'Executor'
    };
    return labels[status] || status;
  }
}
