import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1>Proprietățile Mele</h1>
        <p>Gestionare bunuri impozabile</p>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="empty-state">
            <mat-icon>home</mat-icon>
            <p>Nu aveți proprietăți înregistrate</p>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Adaugă proprietate
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: var(--text-secondary);
      
      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }
      
      p { margin-bottom: 24px; }
    }
  `]
})
export class PropertiesListComponent {}