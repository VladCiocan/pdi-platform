import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface InstitutionInfo {
  name: string;
  cui: string;
  address: string;
  phone: string;
  email: string;
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

interface SecuritySettings {
  sessionTimeout: number;
  require2FA: boolean;
  minPasswordLength: number;
  lockoutAttempts: number;
}


@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="page-container fade-in">
      <h1><mat-icon>settings</mat-icon> Setari Sistem</h1>
      <p class="page-subtitle">Configurati parametrii sistemului PDI</p>

      <mat-accordion multi>
        <!-- Institution Info -->
        <mat-expansion-panel [expanded]="true">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>business</mat-icon>
              Informatii Institutie
            </mat-panel-title>
            <mat-panel-description>
              Datele de identificare ale institutiei
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Denumire Institutie</mat-label>
              <input matInput [(ngModel)]="institution.name" placeholder="Ex: Primaria Comunei Nucet">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>CUI</mat-label>
              <input matInput [(ngModel)]="institution.cui" placeholder="Ex: RO12345678">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Adresa</mat-label>
              <input matInput [(ngModel)]="institution.address" placeholder="Ex: Str. Principala nr. 1, Nucet, Bihor">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Telefon</mat-label>
              <input matInput [(ngModel)]="institution.phone" placeholder="Ex: 0259 123 456">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="institution.email" placeholder="Ex: contact@nucet.ro">
            </mat-form-field>
          </div>

          <div class="panel-actions">
            <button mat-raised-button color="primary" (click)="saveInstitution()">
              <mat-icon>save</mat-icon> Salveaza
            </button>
          </div>
        </mat-expansion-panel>

        <!-- Notification Settings -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>notifications_active</mat-icon>
              Notificari
            </mat-panel-title>
            <mat-panel-description>
              Canale de notificare si preferinte
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="toggle-list">
            <div class="toggle-item">
              <div class="toggle-info">
                <mat-icon>email</mat-icon>
                <div>
                  <strong>Notificari Email</strong>
                  <p>Trimiteti notificari prin email catre utilizatori</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="notifications.emailEnabled" color="primary"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="toggle-item">
              <div class="toggle-info">
                <mat-icon>sms</mat-icon>
                <div>
                  <strong>Notificari SMS</strong>
                  <p>Trimiteti notificari prin SMS pentru evenimente importante</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="notifications.smsEnabled" color="primary"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="toggle-item">
              <div class="toggle-info">
                <mat-icon>notifications</mat-icon>
                <div>
                  <strong>Notificari Push</strong>
                  <p>Notificari in timp real in browser</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="notifications.pushEnabled" color="primary"></mat-slide-toggle>
            </div>
          </div>

          <div class="panel-actions">
            <button mat-raised-button color="primary" (click)="saveNotifications()">
              <mat-icon>save</mat-icon> Salveaza
            </button>
          </div>
        </mat-expansion-panel>

        <!-- Security Settings -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>security</mat-icon>
              Securitate
            </mat-panel-title>
            <mat-panel-description>
              Politici de securitate si autentificare
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Timeout Sesiune (minute)</mat-label>
              <mat-select [(ngModel)]="security.sessionTimeout">
                <mat-option [value]="15">15 minute</mat-option>
                <mat-option [value]="30">30 minute</mat-option>
                <mat-option [value]="60">1 ora</mat-option>
                <mat-option [value]="120">2 ore</mat-option>
                <mat-option [value]="480">8 ore</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Lungime Minima Parola</mat-label>
              <mat-select [(ngModel)]="security.minPasswordLength">
                <mat-option [value]="6">6 caractere</mat-option>
                <mat-option [value]="8">8 caractere</mat-option>
                <mat-option [value]="10">10 caractere</mat-option>
                <mat-option [value]="12">12 caractere</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Incercari Blocare Cont</mat-label>
              <mat-select [(ngModel)]="security.lockoutAttempts">
                <mat-option [value]="3">3 incercari</mat-option>
                <mat-option [value]="5">5 incercari</mat-option>
                <mat-option [value]="10">10 incercari</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="toggle-list" style="margin-top: 8px;">
            <div class="toggle-item">
              <div class="toggle-info">
                <mat-icon>verified_user</mat-icon>
                <div>
                  <strong>Autentificare in 2 Pasi (2FA)</strong>
                  <p>Obligatoriu pentru toti utilizatorii</p>
                </div>
              </div>
              <mat-slide-toggle [(ngModel)]="security.require2FA" color="primary"></mat-slide-toggle>
            </div>
          </div>

          <div class="panel-actions">
            <button mat-raised-button color="primary" (click)="saveSecurity()">
              <mat-icon>save</mat-icon> Salveaza
            </button>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .page-subtitle {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-panel-title mat-icon {
      color: var(--primary-color);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 16px 0;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .toggle-list {
      margin: 16px 0;
    }

    .toggle-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
    }

    .toggle-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .toggle-info mat-icon {
      color: var(--primary-color);
      font-size: 24px;
    }

    .toggle-info strong {
      display: block;
      margin-bottom: 2px;
    }

    .toggle-info p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .panel-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminSettingsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);

  institution: InstitutionInfo = {
    name: '',
    cui: '',
    address: '',
    phone: '',
    email: ''
  };

  notifications: NotificationSettings = {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true
  };

  security: SecuritySettings = {
    sessionTimeout: 30,
    require2FA: false,
    minPasswordLength: 8,
    lockoutAttempts: 5
  };

  ngOnInit() {
    this.loadSettings();
  }

  private loadSettings() {
    this.http.get<InstitutionInfo>(`${environment.authUrl}/settings/institution`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data) this.institution = data;
    });

    this.http.get<NotificationSettings>(`${environment.authUrl}/settings/notifications`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data) this.notifications = data;
    });

    this.http.get<SecuritySettings>(`${environment.authUrl}/settings/security`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data) this.security = data;
    });
  }

  saveInstitution() {
    this.http.put(`${environment.authUrl}/settings/institution`, this.institution).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la salvarea setarilor', 'Inchide', { duration: 3000 });
        return of(null);
      })
    ).subscribe((result) => {
      if (result !== null) {
        this.snackBar.open('Informatiile institutiei au fost salvate', 'Inchide', { duration: 3000 });
      }
    });
  }

  saveNotifications() {
    this.http.put(`${environment.authUrl}/settings/notifications`, this.notifications).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la salvarea setarilor', 'Inchide', { duration: 3000 });
        return of(null);
      })
    ).subscribe((result) => {
      if (result !== null) {
        this.snackBar.open('Setarile de notificari au fost salvate', 'Inchide', { duration: 3000 });
      }
    });
  }

  saveSecurity() {
    this.http.put(`${environment.authUrl}/settings/security`, this.security).pipe(
      catchError(() => {
        this.snackBar.open('Eroare la salvarea setarilor', 'Inchide', { duration: 3000 });
        return of(null);
      })
    ).subscribe((result) => {
      if (result !== null) {
        this.snackBar.open('Setarile de securitate au fost salvate', 'Inchide', { duration: 3000 });
      }
    });
  }
}
