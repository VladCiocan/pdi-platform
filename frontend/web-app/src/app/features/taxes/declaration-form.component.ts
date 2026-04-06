import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-declaration-form', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><div class="page-header"><h1>Declarație Fiscală</h1></div><mat-card><mat-card-content><p>Formular declarație...</p></mat-card-content></mat-card></div>` })
export class DeclarationFormComponent {}
@Component({ selector: 'app-payment', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><div class="page-header"><h1>Plată Taxe</h1></div><mat-card><mat-card-content><p>Formular plată...</p></mat-card-content></mat-card></div>` })
export class PaymentComponent {}
@Component({ selector: 'app-tax-simulator', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><div class="page-header"><h1>Simulator Taxe</h1></div><mat-card><mat-card-content><p>Calculator taxe...</p></mat-card-content></mat-card></div>` })
export class TaxSimulatorComponent {}