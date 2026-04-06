import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TaxService } from '../../core/services/tax.service';
import { TaxLiability } from '../../core/models';

@Component({
  selector: 'app-taxes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatPaginatorModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1>Taxe și Impozite</h1>
        <p>Gestionează obligațiile tale fiscale și plățile</p>
      </div>

      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-icon class="card-icon pending">schedule</mat-icon>
          <div class="card-content">
            <span class="label">De plată</span>
            <span class="value">{{ totalPending() | currency:'RON' }}</span>
          </div>
        </mat-card>
        <mat-card class="summary-card">
          <mat-icon class="card-icon overdue">warning</mat-icon>
          <div class="card-content">
            <span class="label">Restante</span>
            <span class="value">{{ totalOverdue() | currency:'RON' }}</span>
          </div>
        </mat-card>
        <mat-card class="summary-card">
          <mat-icon class="card-icon paid">check_circle</mat-icon>
          <div class="card-content">
            <span class="label">Achitat</span>
            <span class="value">{{ totalPaid() | currency:'RON' }}</span>
          </div>
        </mat-card>
      </div>

      <mat-card>
        <mat-tab-group>
          <mat-tab label="Toate">
            <div class="table-container">
              <table mat-table [dataSource]="liabilities()" class="full-width-table">
                <ng-container matColumnDef="year">
                  <th mat-header-cell *matHeaderCellDef>An</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.year }}</td>
                </ng-container>
                
                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Categorie's</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.categoryId }}</td>
                </ng-container>

                <ng-container matColumnDef="totalDue">
                  <th mat-header-cell *matHeaderCellDef>Total</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.totalDue | currency:'RON' }}</td>
                </ng-container>
                
                <ng-container matColumnDef="paid">
                  <th mat-header-cell *matHeaderCellDef>Achitat</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.paidAmount | currency:'RON' }}</td>
                </ng-container>
                
                <ng-container matColumnDef="remaining">
                  <th mat-header-cell *matHeaderCellDef>Ramas</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.remainingAmount | currency:'RON' }}</td>
                </ng-container>
                
                <ng-container matColumnDef="dueDate">
                  <th mat-header-cell *matHeaderCellDef>Scadenta</th>
                  <td mat-cell *matCellDef="let liab">{{ liab.dueDate | date:'dd/MM/yyyy' }}</td>
                </ng-container>
                
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let liab">
                    <span class="status-badge" [ngClass]="'status-' + liab.status.toLowerCase()">
                      {{ getStatusLabel(liab.status) }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let liab">
                    <button mat-icon-button color="primary" routerLink="/taxes/pay" [queryParams]="{liabilityId: liab.id}">
                      <mat-icon>payment</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
              <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
            </div>
          </mat-tab>
          <mat-tab label="Restante">
            <div class="empty-state">
              <mat-icon>check_circle</mat-icon>
              <p>Nu aveți obligații restante</p>
            </div>
          </mat-tab>
          <mat-tab label="Istoric plăti">
            <div class="empty-state">
              <mat-icon>receipt_long</mat-icon>
              <p>Nu aveți istoric de plăti</p>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>

      <div class="action-buttons">
        <button mat-raised-button color="primary" routerLink="/taxes/declaration">
          <mat-icon>add</mat-icon>
          Declarație nouă
        </button>
        <button mat-stroked-button routerLink="/taxes/simulator">
          <mat-icon>calculate</mat-icon>
          Simulator calcul
        </button>
        <button mat-stroked-button routerLink="/taxes/properties">
          <mat-icon>home</mat-icon>
          Proprietăți
        </button>
      </div>
    </div>
  `,
  styles: [`
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;

      .card-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;

        &.pending { color: #ff9800; }
        &.overdue { color: #f44336; }
        &.paid { color: #4caf50; }
      }

      .card-content {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .value {
          font-size: 24px;
          font-weight: 500;
        }
      }
    }

    .table-container {
      padding: 16px 0;
    }

    .full-width-table {
      width: 100%;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: var(--text-secondary);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }

    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaxesListComponent implements OnInit {
  liabilities = signal<TaxLiability[]>([]);
  totalPending = signal(0);
  totalOverdue = signal(0);
  totalPaid = signal(0);
  displayedColumns = ['year', 'category', 'totalDue', 'paid', 'remaining', 'dueDate', 'status', 'actions'];

  constructor(private taxService: TaxService) {}

  ngOnInit(): void {
    this.loadLiabilities();
  }

  loadLiabilities(): void {
    this.taxService.getLiabilities().subscribe({
      next: (data) => this.liabilities.set(data),
      error: () => this.liabilities.set([])
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Neachitat',
      PARTIAL: 'Partial',
      PAID: 'Achitat',
      OVERDUE: 'Restant',
      ENFORCED: 'Executor'
    };
    return labels[status] || status;
  }
}