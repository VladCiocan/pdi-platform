import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TAXES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./taxes-list.component').then(m => m.TaxesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'properties',
    loadComponent: () => import('./properties-list.component').then(m => m.PropertiesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./property-detail.component').then(m => m.PropertyDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'declaration',
    loadComponent: () => import('./declaration-form.component').then(m => m.DeclarationFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'pay',
    loadComponent: () => import('./payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'simulator',
    loadComponent: () => import('./tax-simulator.component').then(m => m.TaxSimulatorComponent),
    canActivate: [authGuard]
  }
];