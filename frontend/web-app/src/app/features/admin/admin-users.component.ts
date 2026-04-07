import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

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
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1><mat-icon>group</mat-icon> Gestionare Utilizatori</h1>
        <p>Administrati utilizatorii sistemului PDI</p>
      </div>

      <mat-card>
        <mat-card-content>
          <!-- Search Bar -->
          <div class="search-bar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Cautare utilizatori</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Cautati dupa nume sau email...">
              @if (searchTerm) {
                <button matSuffix mat-icon-button (click)="clearSearch()">
                  <mat-icon>clear</mat-icon>
                </button>
              }
            </mat-form-field>
            <span class="result-count">{{ filteredUsers().length }} utilizatori</span>
          </div>

          @if (loading) {
            <div class="loading-state">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Se incarca utilizatorii...</p>
            </div>
          } @else {
            <table mat-table [dataSource]="filteredUsers()" class="users-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nume</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-name-cell">
                    <div class="user-avatar">{{ getInitials(user.name) }}</div>
                    {{ user.name }}
                  </div>
                </td>
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
                <th mat-header-cell *matHeaderCellDef>Actiuni</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button matTooltip="Editeaza" color="primary" (click)="editUser(user)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button
                          [matTooltip]="user.isActive ? 'Dezactiveaza' : 'Activeaza'"
                          [color]="user.isActive ? 'warn' : 'accent'"
                          (click)="toggleUserStatus(user)">
                    <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Sterge" color="warn" (click)="deleteUser(user)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (filteredUsers().length === 0) {
              <div class="empty-state">
                <mat-icon>person_off</mat-icon>
                @if (searchTerm) {
                  <p>Nu s-au gasit utilizatori pentru "{{ searchTerm }}"</p>
                  <button mat-stroked-button (click)="clearSearch()">Sterge cautarea</button>
                } @else {
                  <p>Nu exista utilizatori de afisat</p>
                }
              </div>
            }
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

    .search-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
    }

    .result-count {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .users-table {
      width: 100%;
    }

    .user-name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 500;
      flex-shrink: 0;
    }

    .role-chip {
      font-size: 12px;
      margin-right: 4px;
    }

    .loading-state {
      text-align: center;
      padding: 48px;
    }

    .loading-state p {
      margin-top: 16px;
      color: var(--text-secondary);
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
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'email', 'roles', 'status', 'lastLogin', 'actions'];
  allUsers = signal<AdminUser[]>([]);
  searchTerm = '';
  loading = false;

  filteredUsers = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.allUsers();
    return this.allUsers().filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.roles.some(r => r.toLowerCase().includes(term))
    );
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<AdminUser[]>(`${environment.authUrl}/users`).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la incarcarea datelor', 'Inchide', { duration: 3000 });
        return of([] as AdminUser[]);
      })
    ).subscribe((users) => {
      this.allUsers.set(users);
      this.loading = false;
    });
  }

  onSearchChange() {
    // Triggers computed signal reactivity through template binding
  }

  clearSearch() {
    this.searchTerm = '';
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    return parts.length >= 2
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`
      : name.charAt(0);
  }

  editUser(user: AdminUser) {
    this.snackBar.open(`Se editeaza utilizatorul: ${user.name}`, 'Inchide', { duration: 3000 });
  }

  toggleUserStatus(user: AdminUser) {
    const newStatus = !user.isActive;
    const action = user.isActive ? 'dezactivat' : 'activat';
    this.http.put(`${environment.authUrl}/users/${user.id}`, { isActive: newStatus }).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la actualizarea utilizatorului', 'Inchide', { duration: 3000 });
        return of(null);
      })
    ).subscribe((result) => {
      if (result !== null) {
        this.updateUserInList(user.id, { isActive: newStatus });
        this.snackBar.open(`Utilizatorul ${user.name} a fost ${action}`, 'Inchide', { duration: 3000 });
      }
    });
  }

  deleteUser(user: AdminUser) {
    this.http.delete(`${environment.authUrl}/users/${user.id}`).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la stergerea utilizatorului', 'Inchide', { duration: 3000 });
        return of(null);
      })
    ).subscribe((result) => {
      if (result !== null) {
        this.allUsers.update(users => users.filter(u => u.id !== user.id));
        this.snackBar.open(`Utilizatorul ${user.name} a fost sters`, 'Inchide', { duration: 3000 });
      }
    });
  }

  private updateUserInList(userId: string, changes: Partial<AdminUser>) {
    this.allUsers.update(users =>
      users.map(u => u.id === userId ? { ...u, ...changes } : u)
    );
  }

}
