import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-dms-list', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><h1>Documente</h1><p>Management documente și workflows</p></div>` })
export class DmsListComponent {}