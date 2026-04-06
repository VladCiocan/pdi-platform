import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  permission?: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav #sidenav mode="side" [opened]="!isMobile()" class="sidebar">
        <div class="sidebar-header">
          <img src="assets/logo.svg" alt="Logo" class="logo" (error)="hideLogo($event)">
          <span class="app-name">PDI Nucet</span>
        </div>

        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <a mat-list-item 
               [routerLink]="item.route" 
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>

        <div class="sidebar-footer">
          <mat-nav-list>
            <a mat-list-item routerLink="/admin/settings">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Setări</span>
            </a>
            <a mat-list-item (click)="logout()">
              <mat-icon matListItemIcon>logout</mat-icon>
              <span matListItemTitle>Deconectare</span>
            </a>
          </mat-nav-list>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="toolbar-spacer"></span>

          <button mat-icon-button matTooltip="Notificări" [matBadge]="notificationCount()" matBadgeColor="warn">
            <mat-icon>notifications</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-info">
              <strong>{{ userName() }}</strong>
              <small>{{ userEmail() }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              Profil
            </button>
            <button mat-menu-item routerLink="/admin/settings">
              <mat-icon>settings</mat-icon>
              Setări
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Deconectare
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container {
      height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: #fff;
      border-right: 1px solid var(--border-color);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);

      .logo {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: var(--primary-color);
        padding: 4px;
      }

      .app-name {
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-color);
      }
    }

    .sidebar-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      border-top: 1px solid var(--border-color);
    }

    .main-content {
      display: flex;
      flex-direction: column;
      background: var(--background-color);
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #fff;
      border-bottom: 1px solid var(--border-color);
    }

    .toolbar-spacer {
      flex: 1;
    }

    .menu-button {
      margin-right: 16px;
    }

    .content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .user-info {
      padding: 16px;
      display: flex;
      flex-direction: column;

      strong {
        font-size: 14px;
      }

      small {
        color: var(--text-secondary);
        font-size: 12px;
      }
    }

    .active {
      background: rgba(21, 101, 192, 0.1) !important;
      color: var(--primary-color) !important;

      mat-icon {
        color: var(--primary-color) !important;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 200px;
      }
    }
  `]
})
export class ShellComponent {
  isMobile = signal(window.innerWidth < 768);
  notificationCount = signal(0);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Taxe și Impozite', icon: 'account_balance', route: '/taxes' },
    { label: 'Urbanism', icon: 'location_city', route: '/urbanism' },
    { label: 'Agricultură', icon: 'agriculture', route: '/agriculture' },
    { label: 'Infrastructură', icon: '_construction', route: '/infrastructure' },
    { label: 'ERP', icon: 'business_center', route: '/erp' },
    { label: 'Documente', icon: 'folder', route: '/dms' },
    { label: 'Proiecte', icon: 'assignment', route: '/project' },
    { label: 'Administrare', icon: 'admin_panel_settings', route: '/admin' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  userName(): string {
    const user = this.authService.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Utilizator';
  }

  userEmail(): string {
    const user = this.authService.currentUser();
    return user?.email || '';
  }

  logout(): void {
    this.authService.logout();
  }

  hideLogo(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}