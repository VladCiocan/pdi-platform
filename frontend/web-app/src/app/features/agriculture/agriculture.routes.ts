import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
export const AGRICULTURE_ROUTES: Routes = [{ path: '', loadComponent: () => import('./agriculture-list.component').then(m => m.AgricultureListComponent), canActivate: [authGuard] }];