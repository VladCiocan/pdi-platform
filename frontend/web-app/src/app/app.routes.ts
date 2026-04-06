import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      {
        path: 'taxes',
        loadChildren: () => import('./features/taxes/taxes.routes').then(m => m.TAXES_ROUTES)
      },
      {
        path: 'urbanism',
        loadChildren: () => import('./features/urbanism/urbanism.routes').then(m => m.URBANISM_ROUTES)
      },
      {
        path: 'agriculture',
        loadChildren: () => import('./features/agriculture/agriculture.routes').then(m => m.AGRICULTURE_ROUTES)
      },
      {
        path: 'infrastructure',
        loadChildren: () => import('./features/infrastructure/infrastructure.routes').then(m => m.INFRASTRUCTURE_ROUTES)
      },
      {
        path: 'erp',
        loadChildren: () => import('./features/erp/erp.routes').then(m => m.ERP_ROUTES)
      },
      {
        path: 'dms',
        loadChildren: () => import('./features/dms/dms.routes').then(m => m.DMS_ROUTES)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'project',
        loadChildren: () => import('./features/project/project.routes').then(m => m.PROJECT_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];