import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./admin-list.component').then(m => m.AdminListComponent), canActivate: [authGuard] },
  { path: 'settings', loadComponent: () => import('./admin-settings.component').then(m => m.AdminSettingsComponent), canActivate: [authGuard] },
  { path: 'users', loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent), canActivate: [authGuard] }
];
