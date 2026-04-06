import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1>Detalii Proprietate</h1>
      </div>
      <mat-card>
        <mat-card-content>
          <p>Detalii proprietate...</p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class PropertyDetailComponent {}