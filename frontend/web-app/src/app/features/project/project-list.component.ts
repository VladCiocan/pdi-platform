import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-project-list', standalone: true, imports: [CommonModule, MatCardModule], template: `<div class="page-container fade-in"><h1>Proiecte</h1><p>Management proiecte și sarcini</p></div>` })
export class ProjectListComponent {}