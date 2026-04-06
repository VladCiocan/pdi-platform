import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-erp-list', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><h1>ERP</h1><p>Sistem ERP - Buget, Contabilitate, HR, Stocuri</p></div>` })
export class ErpListComponent {}