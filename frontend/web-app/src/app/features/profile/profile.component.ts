import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container fade-in">
      <h1><mat-icon>person</mat-icon> Profilul Meu</h1>

      @if (user()) {
        <mat-tab-group>
          <!-- Personal Info Tab -->
          <mat-tab label="Informații Personale">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Date Personale</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="profile-header">
                    <div class="avatar">
                      {{ getInitials(user()!) }}
                    </div>
                    <div class="user-summary">
                      <h2>{{ user()!.firstName }} {{ user()!.lastName }}</h2>
                      <p>{{ user()!.email }}</p>
                    </div>
                  </div>

                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Prenume</mat-label>
                      <input matInput [(ngModel)]="editForm.firstName" [disabled]="!isEditing()">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Nume</mat-label>
                      <input matInput [(ngModel)]="editForm.lastName" [disabled]="!isEditing()">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" [(ngModel)]="editForm.email" [disabled]="!isEditing()">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Tip Utilizator</mat-label>
                      <input matInput [value]="user()!.userType" disabled>
                    </mat-form-field>
                  </div>

                  <div class="actions">
                    @if (!isEditing()) {
                      <button mat-raised-button color="primary" (click)="startEditing()">
                        <mat-icon>edit</mat-icon> Editează
                      </button>
                    } @else {
                      <button mat-button (click)="cancelEdit()">Anulează</button>
                      <button mat-raised-button color="primary" (click)="saveProfile()">
                        <mat-icon>save</mat-icon> Salvează
                      </button>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Roles & Permissions Tab -->
          <mat-tab label="Roluri și Permisiuni">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Rolurile Tale</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="roles-list">
                    @for (role of user()!.roles; track role.id) {
                      <mat-chip class="role-chip" color="primary" selected>
                        {{ role.name }}
                      </mat-chip>
                    }
                  </div>

                  <mat-divider></mat-divider>

                  <h3>Permisiuni</h3>
                  <div class="permissions-grid">
                    @for (role of user()!.roles; track role.id) {
                      @for (perm of role.permissions; track perm.code) {
                        <div class="permission-item">
                          <mat-icon>check_circle</mat-icon>
                          <span>{{ perm.name }} ({{ role.name }})</span>
                        </div>
                      }
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Activity Tab -->
          <mat-tab label="Activitate Recentă">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <p class="no-data">Nu există activitate recentă de afișat.</p>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <p>Nu s-au putut încărca datele profilului.</p>
      }
    </div>
  `,
  styles: [`
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 500;
    }

    .user-summary h2 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .user-summary p {
      margin: 0;
      color: var(--text-secondary);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .roles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    .role-chip {
      font-size: 14px;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 16px;
    }

    .permission-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 4px;
      background: #f5f5f5;
    }

    .permission-item mat-icon {
      color: #4caf50;
      font-size: 18px;
    }

    .no-data {
      text-align: center;
      padding: 48px;
      color: #999;
    }

    @media (max-width: 768px) {
      .form-grid, .permissions-grid {
        grid-template-columns: 1fr;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  user = signal<User | null>(null);
  isEditing = signal(false);

  editForm = {
    firstName: '',
    lastName: '',
    email: ''
  };

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    this.user.set(currentUser);
    if (currentUser) {
      this.editForm = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      };
    }
  }

  getInitials(u: User): string {
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`;
  }

  getAllPermissions(): string[] {
    const perms: string[] = [];
    const user = this.user();
    if (user) {
      for (const role of user.roles) {
        for (const perm of role.permissions) {
          if (!perms.includes(perm.code)) {
            perms.push(perm.code);
          }
        }
      }
    }
    return perms;
  }

  startEditing() {
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.editForm = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      };
    }
  }

  saveProfile() {
    // In a real app, would call API to update profile
    this.isEditing.set(false);
    this.snackBar.open('Profil salvat cu succes', 'Închide', { duration: 3000 });
  }
}
