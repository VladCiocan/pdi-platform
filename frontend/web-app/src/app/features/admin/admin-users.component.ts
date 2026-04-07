import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastLogin: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1><mat-icon>group</mat-icon> Gestionare Utilizatori</h1>
        <p>Administrați utilizatorii sistemului PDI</p>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="users()" class="users-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nume</th>
              <td mat-cell *matCellDef="let user">{{ user.name }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="roles">
              <th mat-header-cell *matHeaderCellDef>Roluri</th>
              <td mat-cell *matCellDef="let user">
                @for (role of user.roles; track role) {
                  <mat-chip class="role-chip" color="primary" selected>{{ role }}</mat-chip>
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Stare</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [color]="user.isActive ? 'accent' : 'warn'" selected>
                  {{ user.isActive ? 'Activ' : 'Inactiv' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="lastLogin">
              <th mat-header-cell *matHeaderCellDef>Ultima Accesare</th>
              <td mat-cell *matCellDef="let user">{{ user.lastLogin }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button matTooltip="Editează" color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Dezactivează" color="warn" *ngIf="user.isActive">
                  <mat-icon>block</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Activează" color="accent" *ngIf="!user.isActive">
                  <mat-icon>check_circle</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          @if (users().length === 0) {
            <div class="empty-state">
              <mat-icon>person_off</mat-icon>
              <p>Nu există utilizatori de afișat</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
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

    .users-table {
      width: 100%;
    }

    .role-chip {
      font-size: 12px;
      margin-right: 4px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'email', 'roles', 'status', 'lastLogin', 'actions'];
  users = signal<AdminUser[]>([]);

  ngOnInit() {
    // Mock data - would be replaced with actual API call
    this.users.set([
      {
        id: '1',
        name: 'Popescu Ion',
        email: 'ion.popescu@nucet.ro',
        roles: ['ADMIN'],
        isActive: true,
        lastLogin: '2026-04-07 09:30'
      },
      {
        id: '2',
        name: 'Ionescu Maria',
        email: 'maria.ionescu@nucet.ro',
        roles: ['TAX_INSPECTOR', 'GIS_USER'],
        isActive: true,
        lastLogin: '2026-04-06 14:15'
      },
      {
        id: '3',
        name: 'Dumitrescu Gheorghe',
        email: 'gheorghe.dumitrescu@nucet.ro',
        roles: ['URBANISM_INSPECTOR'],
        isActive: false,
        lastLogin: '2026-03-15 11:00'
      }
    ]);
  }
}
