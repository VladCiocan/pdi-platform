import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-agriculture-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `<div class="page-container fade-in"><div class="page-header"><h1>Agricultură</h1><p>Registru agricol și culturi</p></div><mat-card><mat-card-content><div class="empty-state"><mat-icon>agriculture</mat-icon><p>Nu aveți înregistrări în registrul agricol</p><button mat-raised-button color="primary"><mat-icon>add</mat-icon> Adaugă înregistrare</button></div></mat-card-content></mat-card></div>`,
  styles: [`.empty-state{display:flex;flex-direction:column;align-items:center;padding:48px;color:var(--text-secondary)} .empty-state mat-icon{font-size:64px;width:64px;height:64px;margin-bottom:16px}`]
})
export class AgricultureListComponent {}