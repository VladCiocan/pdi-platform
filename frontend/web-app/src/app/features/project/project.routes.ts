import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
export const PROJECT_ROUTES: Routes = [{ path: '', loadComponent: () => import('./project-list.component').then(m => m.ProjectListComponent), canActivate: [authGuard] }];