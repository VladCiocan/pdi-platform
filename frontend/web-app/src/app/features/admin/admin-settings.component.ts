import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-container fade-in">
      <h1><mat-icon>settings</mat-icon> Setări Sistem</h1>

      <div class="settings-grid">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon>business</mat-icon>
            <mat-card-title>Informații Instituție</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Configurați datele instituției și ale localității.</p>
            <button mat-stroked-button color="primary">Configurează</button>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon>notifications_active</mat-icon>
            <mat-card-title>Notificări</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gestionați șabloanele și regulile de notificare.</p>
            <button mat-stroked-button color="primary">Configurează</button>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon>security</mat-icon>
            <mat-card-title>Securitate</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Politici de parolă, 2FA și sesiuni utilizatori.</p>
            <button mat-stroked-button color="primary">Configurează</button>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon>storage</mat-icon>
            <mat-card-title>Backup & Restaurare</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Configurați backup-ul automat și restaurarea datelor.</p>
            <button mat-stroked-button color="primary">Configurează</button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .settings-card {
      transition: box-shadow 0.2s;
    }

    .settings-card:hover {
      box-shadow: var(--shadow-2);
    }

    .settings-card mat-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .settings-card mat-card-header mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color);
    }

    .settings-card mat-card-content p {
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
  `]
})
export class AdminSettingsComponent {}
