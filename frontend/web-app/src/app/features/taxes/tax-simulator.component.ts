import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tax-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule],
  template: `
    <div class="simulator-container">
      <mat-card class="simulator-card">
        <mat-card-header>
          <mat-card-title>Simulator Taxe și Impozite</mat-card-title>
          <mat-card-subtitle>Calculează suma pe care o datorezi</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tip impozit</mat-label>
            <mat-select [(ngModel)]="taxType">
              <mat-option value="property">Imobil</mat-option>
              <mat-option value="vehicle">Vehicul</mat-option>
              <mat-option value="land">Teren</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" *ngIf="taxType === 'property'">
            <mat-label>Tip proprietate</mat-label>
            <mat-select [(ngModel)]="propertyType">
              <mat-option value="residential">Rezidențial</mat-option>
              <mat-option value="commercial">Comercial</mat-option>
              <mat-option value="industrial">Industrial</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ taxType === 'vehicle' ? 'Cilindree (cc)' : 'Suprafața (mp)' }}</mat-label>
            <input matInput type="number" [(ngModel)]="value">
            <mat-icon matSuffix>square_foot</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Zona</mat-label>
            <mat-select [(ngModel)]="zone">
              <mat-option value="A">Zona A - Centru</mat-option>
              <mat-option value="B">Zona B - Periferie</mat-option>
              <mat-option value="C">Zona C - Rural</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" (click)="calculate()">
            Calculează
          </button>

          <div *ngIf="result" class="result-section">
            <h3>Rezultat</h3>
            <table>
              <tr><td>Impozit de bază:</td><td>{{ result.baseTax | number:'1.2-2' }} RON</td></tr>
              <tr><td>Coeficient zonă:</td><td>{{ result.zoneMultiplier }}x</td></tr>
              <tr><td>Discount (plată anticipată):</td><td>-{{ result.discount | number:'1.2-2' }} RON</td></tr>
              <tr class="total"><td>Total de plată:</td><td>{{ result.total | number:'1.2-2' }} RON</td></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .simulator-container { padding: 20px; }
    .simulator-card { max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .result-section { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    table { width: 100%; }
    td { padding: 8px; }
    .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; }
  `]
})
export class TaxSimulatorComponent {
  taxType = 'property';
  propertyType = 'residential';
  value = 0;
  zone = 'A';
  result: any = null;

  calculate() {
    const baseRates: any = { property: 0.001, vehicle: 0.002, land: 0.003 };
    const zoneMultipliers: any = { A: 1.5, B: 1.0, C: 0.75 };
    
    const baseTax = this.value * (baseRates[this.taxType as keyof typeof baseRates] || 0.001);
    const zoneMult = zoneMultipliers[this.zone as keyof typeof zoneMultipliers] || 1;
    const adjustedTax = baseTax * zoneMult;
    const discount = adjustedTax * 0.1;
    
    this.result = {
      baseTax: adjustedTax,
      zoneMultiplier: zoneMult,
      discount: discount,
      total: adjustedTax - discount
    };
  }
}