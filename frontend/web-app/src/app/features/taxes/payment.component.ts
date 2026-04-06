import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TaxService } from '../../core/services/tax.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  template: `
    <div class="payment-container">
      <mat-card class="payment-card">
        <mat-card-header>
          <mat-card-title>Plată Taxe și Impozite</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Selectează obligatia fiscala</mat-label>
            <mat-select [(ngModel)]="selectedLiability">
              <mat-option *ngFor="let l of liabilities" [value]="l.id">
                {{ l.description }} - {{ l.amount | number:'1.2-2' }} RON
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Metoda de plata</mat-label>
            <mat-select [(ngModel)]="paymentMethod">
              <mat-option value="card">Card bancar</mat-option>
              <mat-option value="transfer">Transfer bancar</mat-option>
              <mat-option value="cash">Numerar la ghiseu</mat-option>
            </mat-select>
          </mat-form-field>

          <div *ngIf="paymentMethod === 'card'">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Numar card</mat-label>
              <input matInput [(ngModel)]="cardNumber" placeholder="XXXX XXXX XXXX XXXX">
              <mat-icon matSuffix>credit_card</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Expiry</mat-label>
              <input matInput [(ngModel)]="expiry" placeholder="MM/YY">
            </mat-form-field>
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>CVV</mat-label>
              <input matInput [(ngModel)]="cvv" type="password">
            </mat-form-field>
          </div>

          <button mat-raised-button color="primary" class="full-width" (click)="processPayment()" [disabled]="processing">
            {{ processing ? 'Se proceseaza...' : 'Plateste acum' }}
          </button>
          
          <p *ngIf="message" [class]="messageType">{{ message }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .payment-container { padding: 20px; }
    .payment-card { max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .half-width { width: 48%; margin-right: 4%; }
    .success { color: green; }
    .error { color: red; }
  `]
})
export class PaymentComponent {
  liabilities: any[] = [];
  selectedLiability: string = '';
  paymentMethod = 'card';
  cardNumber = '';
  expiry = '';
  cvv = '';
  processing = false;
  message = '';
  messageType = '';

  constructor(private taxService: TaxService, private router: Router) {
    this.taxService.getLiabilities().subscribe(data => this.liabilities = data);
  }

  processPayment() {
    if (!this.selectedLiability) {
      this.message = 'Selectează o obligație fiscală.';
      this.messageType = 'error';
      return;
    }
    this.processing = true;
    setTimeout(() => {
      this.message = 'Plata a fost procesată cu succes!';
      this.messageType = 'success';
      this.processing = false;
      setTimeout(() => this.router.navigate(['/taxes']), 2000);
    }, 2000);
  }
}