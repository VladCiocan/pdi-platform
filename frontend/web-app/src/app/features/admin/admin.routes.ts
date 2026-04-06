import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
export const ADMIN_ROUTES: Routes = [{ path: '', loadComponent: () => import('./admin-list.component').then(m => m.AdminListComponent), canActivate: [authGuard] }];