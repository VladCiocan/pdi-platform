import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const DMS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./dms-list.component').then(m => m.DmsListComponent), canActivate: [authGuard] }
];