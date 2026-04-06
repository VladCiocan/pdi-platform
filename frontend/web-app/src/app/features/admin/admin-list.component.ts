import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-admin-list', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><h1>Administrare</h1><p>Gestionare utilizatori și sistem</p></div>` })
export class AdminListComponent {}