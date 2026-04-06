import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({ selector: 'app-infrastructure-list', standalone: true, imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule], template: `<div class="page-container fade-in"><h1>Infrastructură</h1><p>Gestionare rețele utilități</p></div>` })
export class InfrastructureListComponent {}