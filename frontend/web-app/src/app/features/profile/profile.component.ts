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
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

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
          <mat-tab label="Informatii Personale">
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
                        <mat-icon>edit</mat-icon> Editeaza
                      </button>
                    } @else {
                      <button mat-button (click)="cancelEdit()">Anuleaza</button>
                      <button mat-raised-button color="primary" (click)="saveProfile()" [disabled]="saving()">
                        <mat-icon>save</mat-icon> Salveaza
                      </button>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Password Change Tab -->
          <mat-tab label="Schimbare Parola">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Schimba Parola</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="password-form">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Parola curenta</mat-label>
                      <input matInput [type]="showCurrentPassword ? 'text' : 'password'" [(ngModel)]="passwordForm.currentPassword">
                      <button matSuffix mat-icon-button (click)="showCurrentPassword = !showCurrentPassword">
                        <mat-icon>{{ showCurrentPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                      </button>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Parola noua</mat-label>
                      <input matInput [type]="showNewPassword ? 'text' : 'password'" [(ngModel)]="passwordForm.newPassword">
                      <button matSuffix mat-icon-button (click)="showNewPassword = !showNewPassword">
                        <mat-icon>{{ showNewPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                      </button>
                      <mat-hint>Minim 8 caractere</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Confirma parola noua</mat-label>
                      <input matInput [type]="showConfirmPassword ? 'text' : 'password'" [(ngModel)]="passwordForm.confirmPassword">
                      <button matSuffix mat-icon-button (click)="showConfirmPassword = !showConfirmPassword">
                        <mat-icon>{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                      </button>
                    </mat-form-field>

                    @if (passwordError) {
                      <p class="error-text">{{ passwordError }}</p>
                    }

                    <div class="actions">
                      <button mat-raised-button color="primary" (click)="changePassword()" [disabled]="savingPassword()">
                        <mat-icon>lock</mat-icon> Schimba Parola
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Roles & Permissions Tab -->
          <mat-tab label="Roluri si Permisiuni">
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
          <mat-tab label="Activitate Recenta">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <p class="no-data">Nu exista activitate recenta de afisat.</p>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <p>Nu s-au putut incarca datele profilului.</p>
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

    .password-form {
      max-width: 480px;
      margin-top: 16px;
    }

    .full-width {
      width: 100%;
    }

    .error-text {
      color: #f44336;
      font-size: 14px;
      margin-bottom: 16px;
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
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  user = signal<User | null>(null);
  isEditing = signal(false);
  saving = signal(false);
  savingPassword = signal(false);

  editForm = {
    firstName: '',
    lastName: '',
    email: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  passwordError = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user.set(currentUser);
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

  startEditing() {
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    const currentUser = this.user();
    if (currentUser) {
      this.editForm = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      };
    }
  }

  saveProfile() {
    this.saving.set(true);
    const payload = { ...this.editForm };

    this.http.put(`${environment.authUrl}/profile`, payload).subscribe({
      next: () => {
        this.applyProfileChanges();
        this.saving.set(false);
        this.snackBar.open('Profilul a fost salvat cu succes', 'Inchide', { duration: 3000 });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Eroare la salvarea profilului', 'Inchide', { duration: 3000 });
      }
    });
  }

  private applyProfileChanges() {
    this.isEditing.set(false);

    // Update local user signal
    const currentUser = this.user();
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        firstName: this.editForm.firstName,
        lastName: this.editForm.lastName,
        email: this.editForm.email
      };
      this.user.set(updatedUser);
    }
  }

  changePassword() {
    this.passwordError = '';

    if (!this.passwordForm.currentPassword) {
      this.passwordError = 'Introduceti parola curenta';
      return;
    }

    if (this.passwordForm.newPassword.length < 8) {
      this.passwordError = 'Parola noua trebuie sa aiba minim 8 caractere';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'Parolele noi nu corespund';
      return;
    }

    if (this.passwordForm.currentPassword === this.passwordForm.newPassword) {
      this.passwordError = 'Parola noua trebuie sa fie diferita de cea curenta';
      return;
    }

    this.savingPassword.set(true);

    this.http.post(`${environment.authUrl}/change-password`, {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.resetPasswordForm();
        this.snackBar.open('Parola a fost schimbata cu succes', 'Inchide', { duration: 3000 });
      },
      error: () => {
        this.savingPassword.set(false);
        this.snackBar.open('Eroare la schimbarea parolei', 'Inchide', { duration: 3000 });
      }
    });
  }

  private resetPasswordForm() {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError = '';
  }
}
