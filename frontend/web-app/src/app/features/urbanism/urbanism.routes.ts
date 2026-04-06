import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const URBANISM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./urbanism-list.component').then(m => m.UrbanismListComponent),
    canActivate: [authGuard]
  }
];