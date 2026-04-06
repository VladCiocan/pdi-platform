import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ERP_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./erp-list.component').then(m => m.ErpListComponent), canActivate: [authGuard] }
];