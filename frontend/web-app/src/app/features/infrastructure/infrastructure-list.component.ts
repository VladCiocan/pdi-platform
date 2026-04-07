import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { InfrastructureService } from '../../core/services/infrastructure.service';
import {
  InfrastructureNetwork,
  InfrastructureAsset,
  InfrastructureIncident,
  NetworkType,
  NetworkStatus,
  AssetType,
  AssetStatus,
  IncidentType,
  Severity,
  IncidentStatus
} from '../../core/models/infrastructure.model';

@Component({
  selector: 'app-infrastructure-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabGroup,
    MatTab,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div class="header-content">
          <h1>🔧 Infrastructură</h1>
          <p>Rețele utilitare, active și incidente</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openIncidentDialog()">
            <mat-icon>add</mat-icon> Raportează Incident
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #2196f3;">
              <mat-icon>hub</mat-icon>
            </div>
            <div class="stat-value">{{ stats.networks }}</div>
            <div class="stat-label">Rețele</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="status-icon" style="background: #4caf50;">
              <mat-icon>memory</mat-icon>
            </div>
            <div class="stat-value">{{ stats.assets }}</div>
            <div class="stat-label">Active</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card clickable" (click)="selectedTab = 2">
          <mat-card-content>
            <div class="stat-icon" style="background: #f44336;">
              <mat-icon>warning</mat-icon>
            </div>
            <div class="stat-value">{{ stats.incidents }}</div>
            <div class="stat-label">Incidente</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>error</mat-icon>
            </div>
            <div class="stat-value">{{ stats.criticalIncidents }}</div>
            <div class="stat-label">Critice</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-card class="data-card">
        <mat-tab-group animationDuration="200ms" [(selectedIndex)]="selectedTab">
          
          <!-- Networks Tab -->
          <mat-tab label="Rețele Utilitare">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openNetworkDialog()">
                  <mat-icon>add</mat-icon> Rețea Nouă
                </button>
              </div>
              @if (networks.length === 0) {
                <div class="empty-state">
                  <mat-icon>hub</mat-icon>
                  <p>Nu aveți rețele utilitare</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="networks" class="full-width-table">
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Denumire</th>
                      <td mat-cell *matCellDef="let n">{{ n.name }}</td>
                    </ng-container>
                    <ng-container matColumnDef="networkType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let n">
                        <mat-chip>{{ getNetworkTypeLabel(n.networkType) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="totalLength">
                      <th mat-header-cell *matHeaderCellDef>Lungime (km)</th>
                      <td mat-cell *matCellDef="let n">{{ n.totalLength || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let n">
                        <mat-chip [color]="getNetworkStatusColor(n.status)" selected>{{ getNetworkStatusLabel(n.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let n">
                        <button mat-icon-button color="primary" (click)="viewNetworkAssets(n)">
                          <mat-icon>memory</mat-icon>
                        </button>
                        <button mat-icon-button color="accent" (click)="openNetworkDialog(n)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="networkColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: networkColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Assets Tab -->
          <mat-tab label="Active">
            <div class="tab-content">
              <div class="tab-actions">
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Filtrare după rețea</mat-label>
                  <mat-select [(ngModel)]="filterNetworkId" (selectionChange)="filterAssets()">
                    <mat-option value="">Toate</mat-option>
                    @for (net of networks; track net.id) {
                      <mat-option [value]="net.id">{{ net.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="openAssetDialog()">
                  <mat-icon>add</mat-icon> Activ Nou
                </button>
              </div>
              @if (filteredAssets.length === 0) {
                <div class="empty-state">
                  <mat-icon>memory</mat-icon>
                  <p>Nu aveți active de infrastructură</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="filteredAssets" class="full-width-table">
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Denumire</th>
                      <td mat-cell *matCellDef="let a">{{ a.name }}</td>
                    </ng-container>
                    <ng-container matColumnDef="assetType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let a">
                        <mat-chip>{{ getAssetTypeLabel(a.assetType) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="serialNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Serie</th>
                      <td mat-cell *matCellDef="let a">{{ a.serialNumber || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="manufacturer">
                      <th mat-header-cell *matHeaderCellDef>Producător</th>
                      <td mat-cell *matCellDef="let a">{{ a.manufacturer || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let a">
                        <mat-chip [color]="getAssetStatusColor(a.status)" selected>{{ getAssetStatusLabel(a.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let a">
                        <button mat-icon-button color="accent" (click)="openAssetDialog(a)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="reportIncidentForAsset(a)">
                          <mat-icon>bug_report</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="assetColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: assetColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Incidents Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon [matBadge]="stats.criticalIncidents" [matBadgeHidden]="stats.criticalIncidents === 0" matBadgeColor="warn">warning</mat-icon>
              <span style="margin-left: 8px;">Incidente</span>
            </ng-template>
            <div class="tab-content">
              <div class="tab-actions">
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Severitate</mat-label>
                  <mat-select [(ngModel)]="filterSeverity" (selectionChange)="filterIncidents()">
                    <mat-option value="">Toate</mat-option>
                    <mat-option value="CRITICAL">Critică</mat-option>
                    <mat-option value="HIGH">Ridicată</mat-option>
                    <mat-option value="MEDIUM">Medie</mat-option>
                    <mat-option value="LOW">Scăzută</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="openIncidentDialog()">
                  <mat-icon>add</mat-icon> Incident Nou
                </button>
              </div>
              @if (filteredIncidents.length === 0) {
                <div class="empty-state">
                  <mat-icon>check_circle</mat-icon>
                  <p>Nu aveți incidente raportate</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="filteredIncidents" class="full-width-table">
                    <ng-container matColumnDef="incidentType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let i">
                        <mat-chip>{{ getIncidentTypeLabel(i.incidentType) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="description">
                      <th mat-header-cell *matHeaderCellDef>Descriere</th>
                      <td mat-cell *matCellDef="let i">{{ i.description | slice:0:50 }}{{ i.description.length > 50 ? '...' : '' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="severity">
                      <th mat-header-cell *matHeaderCellDef>Severitate</th>
                      <td mat-cell *matCellDef="let i">
                        <mat-chip [color]="getSeverityColor(i.severity)" selected>{{ getSeverityLabel(i.severity) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let i">
                        <mat-chip>{{ getIncidentStatusLabel(i.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="reportedAt">
                      <th mat-header-cell *matHeaderCellDef>Raportat</th>
                      <td mat-cell *matCellDef="let i">{{ i.reportedAt | date:'dd/MM/yyyy HH:mm' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let i">
                        <button mat-icon-button color="primary" (click)="openIncidentDialog(i)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        @if (i.status === 'NEW' || i.status === 'ACQUIRED') {
                          <button mat-icon-button color="accent" (click)="updateIncidentStatus(i, 'IN_PROGRESS')">
                            <mat-icon>play_arrow</mat-icon>
                          </button>
                        }
                        @if (i.status === 'IN_PROGRESS') {
                          <button mat-icon-button color="accent" (click)="updateIncidentStatus(i, 'RESOLVED')">
                            <mat-icon>check</mat-icon>
                          </button>
                        }
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="incidentColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: incidentColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-card>
    </div>

    <!-- Network Dialog -->
    @if (showNetworkDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingNetwork ? 'Editează' : 'Rețea Nouă' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Denumire</mat-label>
              <input matInput [(ngModel)]="networkForm.name">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip Rețea</mat-label>
              <mat-select [(ngModel)]="networkForm.networkType">
                @for (t of networkTypes; track t.value) {
                  <mat-option [value]="t.value">{{ t.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="networkForm.description" rows="2"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Lungime totală (km)</mat-label>
                <input matInput type="number" [(ngModel)]="networkForm.totalLength">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="networkForm.status">
                  @for (s of networkStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data instalării</mat-label>
              <input matInput type="date" [(ngModel)]="networkForm.installationDate">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveNetwork()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Asset Dialog -->
    @if (showAssetDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingAsset ? 'Editează' : 'Activ Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Denumire</mat-label>
              <input matInput [(ngModel)]="assetForm.name">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tip Activ</mat-label>
                <mat-select [(ngModel)]="assetForm.assetType">
                  @for (t of assetTypes; track t.value) {
                    <mat-option [value]="t.value">{{ t.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Rețea</mat-label>
                <mat-select [(ngModel)]="assetForm.networkId">
                  @for (net of networks; track net.id) {
                    <mat-option [value]="net.id">{{ net.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nr. Serie</mat-label>
                <input matInput [(ngModel)]="assetForm.serialNumber">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Producător</mat-label>
                <input matInput [(ngModel)]="assetForm.manufacturer">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Model</mat-label>
                <input matInput [(ngModel)]="assetForm.model">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="assetForm.status">
                  @for (s of assetStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data instalării</mat-label>
                <input matInput type="date" [(ngModel)]="assetForm.installationDate">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Expirare garanție</mat-label>
                <input matInput type="date" [(ngModel)]="assetForm.warrantyExpiry">
              </mat-form-field>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveAsset()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Incident Dialog -->
    @if (showIncidentDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingIncident ? 'Editează' : 'Raportează Incident' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="incidentForm.description" rows="3" placeholder="Descrieți problema..."></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tip Incident</mat-label>
                <mat-select [(ngModel)]="incidentForm.incidentType">
                  @for (t of incidentTypes; track t.value) {
                    <mat-option [value]="t.value">{{ t.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Severitate</mat-label>
                <mat-select [(ngModel)]="incidentForm.severity">
                  @for (s of severities; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Rețea</mat-label>
                <mat-select [(ngModel)]="incidentForm.networkId">
                  <mat-option value="">N/A</mat-option>
                  @for (net of networks; track net.id) {
                    <mat-option [value]="net.id">{{ net.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Activ</mat-label>
                <mat-select [(ngModel)]="incidentForm.assetId">
                  <mat-option value="">N/A</mat-option>
                  @for (a of assets; track a.id) {
                    <mat-option [value]="a.id">{{ a.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            @if (editingIncident) {
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="incidentForm.status">
                  @for (s of incidentStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Note rezolvare</mat-label>
                <textarea matInput [(ngModel)]="incidentForm.resolutionNotes" rows="2"></textarea>
              </mat-form-field>
            }
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveIncident()">Salvează</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header-content h1 { margin: 0; font-size: 28px; font-weight: 500; }
    .header-content p { margin: 4px 0 0; color: var(--text-secondary); }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 16px; }
    .stat-card.clickable { cursor: pointer; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon mat-icon { color: white; }
    .stat-value { font-size: 28px; font-weight: 600; }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .data-card { margin-bottom: 24px; }
    .tab-content { padding: 24px; min-height: 400px; }
    .tab-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .filter-field { width: 200px; }
    .table-container { overflow-x: auto; }
    .full-width-table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    .empty-state p { margin-bottom: 16px; }
    
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 450px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }
    .dialog-large { width: 550px; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e0e0e0; }
    .dialog-header h2 { margin: 0; font-size: 20px; font-weight: 500; }
    .dialog-body { padding: 24px; overflow-y: auto; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px; border-top: 1px solid #e0e0e0; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 16px; }
    .form-row mat-form-field { flex: 1; }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .form-row { flex-direction: column; }
    }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class InfrastructureListComponent implements OnInit {
  private infrastructureService = inject(InfrastructureService);
  private snackBar = inject(MatSnackBar);

  // Data
  networks: InfrastructureNetwork[] = [];
  assets: InfrastructureAsset[] = [];
  incidents: InfrastructureIncident[] = [];
  filteredAssets: InfrastructureAsset[] = [];
  filteredIncidents: InfrastructureIncident[] = [];

  selectedTab = 0;

  stats = {
    networks: 0,
    assets: 0,
    incidents: 0,
    criticalIncidents: 0
  };

  // Filters
  filterNetworkId = '';
  filterSeverity = '';

  // Table columns
  networkColumns = ['name', 'networkType', 'totalLength', 'status', 'actions'];
  assetColumns = ['name', 'assetType', 'serialNumber', 'manufacturer', 'status', 'actions'];
  incidentColumns = ['incidentType', 'description', 'severity', 'status', 'reportedAt', 'actions'];

  // Dialog states
  showNetworkDialog = false;
  showAssetDialog = false;
  showIncidentDialog = false;

  editingNetwork: InfrastructureNetwork | null = null;
  editingAsset: InfrastructureAsset | null = null;
  editingIncident: InfrastructureIncident | null = null;

  // Forms
  networkForm: Partial<InfrastructureNetwork> = this.getEmptyNetwork();
  assetForm: Partial<InfrastructureAsset> = this.getEmptyAsset();
  incidentForm: Partial<InfrastructureIncident> = this.getEmptyIncident();

  // Options
  networkTypes = [
    { value: 'WATER', label: 'Apă' },
    { value: 'SEWERAGE', label: 'Canalizare' },
    { value: 'ELECTRICITY', label: 'Electricitate' },
    { value: 'GAS', label: 'Gaz' },
    { value: 'LIGHTING', label: 'Iluminat' },
    { value: 'TELEPHONE', label: 'Telefonie' },
    { value: 'INTERNET', label: 'Internet' }
  ];

  networkStatuses = [
    { value: 'ACTIVE', label: 'Activ' },
    { value: 'INACTIVE', label: 'Inactiv' },
    { value: 'UNDER_REPAIR', label: 'În reparație' },
    { value: 'PLANNED', label: 'Planificat' }
  ];

  assetTypes = [
    { value: 'PUMP', label: 'Pompă' },
    { value: 'VALVE', label: 'Vană' },
    { value: 'METER', label: 'Contor' },
    { value: 'HYDRANT', label: 'Hidrant' },
    { value: 'TRANSFORMER', label: 'Transformator' },
    { value: 'POLE', label: 'Stâlp' },
    { value: 'MANHOLE', label: 'Camin' },
    { value: 'CABLE', label: 'Cablu' },
    { value: 'PIPE', label: 'Conductă' },
    { value: 'LIGHT_POINT', label: 'Punct de lumină' },
    { value: 'SENSOR', label: 'Senzor' }
  ];

  assetStatuses = [
    { value: 'ACTIVE', label: 'Activ' },
    { value: 'INACTIVE', label: 'Inactiv' },
    { value: 'UNDER_REPAIR', label: 'În reparație' },
    { value: 'DEFECTIVE', label: 'Defect' },
    { value: 'DECOMMISSIONED', label: 'Dezafectat' }
  ];

  incidentTypes = [
    { value: 'BREAKDOWN', label: 'Panne' },
    { value: 'LEAK', label: 'Scurgere' },
    { value: 'BLOCKAGE', label: 'Înfundare' },
    { value: 'DAMAGE', label: 'Deteriorare' },
    { value: 'MALFUNCTION', label: 'Disfuncționalitate' },
    { value: 'ACCIDENT', label: 'Accident' },
    { value: 'PLANNED_WORK', label: 'Lucrare planificată' }
  ];

  severities = [
    { value: 'CRITICAL', label: 'Critică' },
    { value: 'HIGH', label: 'Ridicată' },
    { value: 'MEDIUM', label: 'Medie' },
    { value: 'LOW', label: 'Scăzută' }
  ];

  incidentStatuses = [
    { value: 'NEW', label: 'Nou' },
    { value: 'ACQUIRED', label: 'Preluat' },
    { value: 'IN_PROGRESS', label: 'În lucru' },
    { value: 'RESOLVED', label: 'Rezolvat' },
    { value: 'CLOSED', label: 'Închis' },
    { value: 'CANCELLED', label: 'Anulat' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.infrastructureService.getNetworks().subscribe({
      next: (data) => { this.networks = data; this.stats.networks = data.length; },
      error: () => { this.networks = this.getMockNetworks(); this.stats.networks = this.networks.length; }
    });

    this.infrastructureService.getAssets().subscribe({
      next: (data) => { 
        this.assets = data; 
        this.filteredAssets = data;
        this.stats.assets = data.length; 
      },
      error: () => { 
        this.assets = this.getMockAssets(); 
        this.filteredAssets = this.assets;
        this.stats.assets = this.assets.length; 
      }
    });

    this.infrastructureService.getIncidents().subscribe({
      next: (data) => { 
        this.incidents = data; 
        this.filteredIncidents = data;
        this.stats.incidents = data.length;
        this.stats.criticalIncidents = data.filter(i => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;
      },
      error: () => { 
        this.incidents = this.getMockIncidents(); 
        this.filteredIncidents = this.incidents;
        this.stats.incidents = this.incidents.length;
        this.stats.criticalIncidents = this.incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;
      }
    });
  }

  filterAssets() {
    if (this.filterNetworkId) {
      this.filteredAssets = this.assets.filter(a => a.networkId === this.filterNetworkId);
    } else {
      this.filteredAssets = [...this.assets];
    }
  }

  filterIncidents() {
    if (this.filterSeverity) {
      this.filteredIncidents = this.incidents.filter(i => i.severity === this.filterSeverity);
    } else {
      this.filteredIncidents = [...this.incidents];
    }
  }

  // Network
  openNetworkDialog(network?: InfrastructureNetwork) {
    this.editingNetwork = network || null;
    this.networkForm = network ? { ...network } : this.getEmptyNetwork();
    this.showNetworkDialog = true;
  }

  saveNetwork() {
    if (this.editingNetwork) {
      const index = this.networks.findIndex(n => n.id === this.editingNetwork!.id);
      if (index >= 0) this.networks[index] = { ...this.networks[index], ...this.networkForm };
      this.showSnackBar('Rețea actualizată');
    } else {
      const newNetwork = { ...this.networkForm, id: crypto.randomUUID() } as InfrastructureNetwork;
      this.networks.push(newNetwork);
      this.stats.networks++;
      this.showSnackBar('Rețea creată');
    }
    this.closeDialogs();
  }

  viewNetworkAssets(network: InfrastructureNetwork) {
    this.filterNetworkId = network.id || '';
    this.selectedTab = 1;
    this.filterAssets();
    this.showSnackBar('Filtrat după: ' + network.name);
  }

  // Asset
  openAssetDialog(asset?: InfrastructureAsset) {
    this.editingAsset = asset || null;
    this.assetForm = asset ? { ...asset } : this.getEmptyAsset();
    this.showAssetDialog = true;
  }

  saveAsset() {
    if (this.editingAsset) {
      const index = this.assets.findIndex(a => a.id === this.editingAsset!.id);
      if (index >= 0) this.assets[index] = { ...this.assets[index], ...this.assetForm };
      this.showSnackBar('Activ actualizat');
    } else {
      const newAsset = { ...this.assetForm, id: crypto.randomUUID() } as InfrastructureAsset;
      this.assets.push(newAsset);
      this.stats.assets++;
      this.showSnackBar('Activ creat');
    }
    this.filterAssets();
    this.closeDialogs();
  }

  reportIncidentForAsset(asset: InfrastructureAsset) {
    this.openIncidentDialog();
    this.incidentForm.assetId = asset.id;
    this.incidentForm.networkId = asset.networkId;
    this.showSnackBar('Raportați incident pentru: ' + asset.name);
  }

  // Incident
  openIncidentDialog(incident?: InfrastructureIncident) {
    this.editingIncident = incident || null;
    this.incidentForm = incident ? { ...incident } : this.getEmptyIncident();
    this.showIncidentDialog = true;
  }

  saveIncident() {
    if (this.editingIncident) {
      const index = this.incidents.findIndex(i => i.id === this.editingIncident!.id);
      if (index >= 0) this.incidents[index] = { ...this.incidents[index], ...this.incidentForm };
      this.showSnackBar('Incident actualizat');
    } else {
      const newIncident = { ...this.incidentForm, id: crypto.randomUUID(), reportedAt: new Date().toISOString() } as InfrastructureIncident;
      this.incidents.push(newIncident);
      this.stats.incidents++;
      if (newIncident.severity === 'CRITICAL') this.stats.criticalIncidents++;
      this.showSnackBar('Incident raportat');
    }
    this.filterIncidents();
    this.closeDialogs();
  }

  updateIncidentStatus(incident: InfrastructureIncident, newStatus: IncidentStatus) {
    incident.status = newStatus;
    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      incident.resolvedAt = new Date().toISOString();
      if (incident.severity === 'CRITICAL') this.stats.criticalIncidents--;
    }
    this.showSnackBar('Status incident actualizat');
    this.filterIncidents();
  }

  closeDialogs() {
    this.showNetworkDialog = false;
    this.showAssetDialog = false;
    this.showIncidentDialog = false;
    this.editingNetwork = null;
    this.editingAsset = null;
    this.editingIncident = null;
  }

  // Labels
  getNetworkTypeLabel(type: NetworkType): string {
    return this.networkTypes.find(t => t.value === type)?.label || type;
  }

  getNetworkStatusLabel(status: NetworkStatus): string {
    return this.networkStatuses.find(s => s.value === status)?.label || status;
  }

  getNetworkStatusColor(status: NetworkStatus): string {
    if (status === 'ACTIVE') return 'accent';
    if (status === 'UNDER_REPAIR') return 'warn';
    return '';
  }

  getAssetTypeLabel(type: AssetType): string {
    return this.assetTypes.find(t => t.value === type)?.label || type;
  }

  getAssetStatusLabel(status: AssetStatus): string {
    return this.assetStatuses.find(s => s.value === status)?.label || status;
  }

  getAssetStatusColor(status: AssetStatus): string {
    if (status === 'ACTIVE') return 'accent';
    if (status === 'DEFECTIVE' || status === 'UNDER_REPAIR') return 'warn';
    return '';
  }

  getIncidentTypeLabel(type: IncidentType): string {
    return this.incidentTypes.find(t => t.value === type)?.label || type;
  }

  getSeverityLabel(severity: Severity): string {
    return this.severities.find(s => s.value === severity)?.label || severity;
  }

  getSeverityColor(severity: Severity): string {
    if (severity === 'CRITICAL') return 'warn';
    if (severity === 'HIGH') return '';
    return 'accent';
  }

  getIncidentStatusLabel(status: IncidentStatus): string {
    return this.incidentStatuses.find(s => s.value === status)?.label || status;
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }

  private getEmptyNetwork() {
    return {
      name: '',
      networkType: 'WATER' as NetworkType,
      status: 'ACTIVE' as NetworkStatus,
      isActive: true
    };
  }

  private getEmptyAsset() {
    return {
      name: '',
      assetType: 'PUMP' as AssetType,
      status: 'ACTIVE' as AssetStatus,
      isActive: true
    };
  }

  private getEmptyIncident() {
    return {
      description: '',
      incidentType: 'BREAKDOWN' as IncidentType,
      severity: 'MEDIUM' as Severity,
      status: 'NEW' as IncidentStatus,
      reportedAt: new Date().toISOString(),
      isActive: true
    };
  }

  // Mock data
  private getMockNetworks(): InfrastructureNetwork[] {
    return [
      { id: crypto.randomUUID(), networkType: 'WATER', name: 'Rețea Apă Potabilă', description: 'Alimentare cu apă a municipiului', status: 'ACTIVE', totalLength: 125.5, installationDate: '2010-05-15', isActive: true },
      { id: crypto.randomUUID(), networkType: 'SEWERAGE', name: 'Rețea Canalizare', description: 'Canalizare menajeră', status: 'ACTIVE', totalLength: 98.3, installationDate: '2010-05-15', isActive: true },
      { id: crypto.randomUUID(), networkType: 'ELECTRICITY', name: 'Rețea Electricitate', description: 'Alimentare cu energie electrică', status: 'ACTIVE', totalLength: 156.8, installationDate: '2008-03-20', isActive: true },
      { id: crypto.randomUUID(), networkType: 'LIGHTING', name: 'Iluminat Public', description: 'Iluminat stradal', status: 'UNDER_REPAIR', totalLength: 45.2, installationDate: '2015-01-10', isActive: true }
    ];
  }

  private getMockAssets(): InfrastructureAsset[] {
    return [
      { id: crypto.randomUUID(), networkId: '', assetType: 'PUMP', name: 'Pompă CP-1', serialNumber: 'PM-2024-001', manufacturer: 'Grundfos', model: 'CR 32', status: 'ACTIVE', installationDate: '2020-06-15', isActive: true },
      { id: crypto.randomUUID(), networkId: '', assetType: 'METER', name: 'Contor Apă SC-1', serialNumber: 'MT-2024-002', manufacturer: 'Sensus', model: 'OMNI', status: 'ACTIVE', installationDate: '2021-03-10', isActive: true },
      { id: crypto.randomUUID(), networkId: '', assetType: 'VALVE', name: 'Vană V-123', serialNumber: 'VL-2024-003', manufacturer: 'Danfoss', model: 'HB', status: 'ACTIVE', installationDate: '2019-08-22', isActive: true },
      { id: crypto.randomUUID(), networkId: '', assetType: 'HYDRANT', name: 'Hidrant H-45', serialNumber: 'HY-2024-004', manufacturer: 'Tyco', status: 'ACTIVE', installationDate: '2018-04-12', isActive: true },
      { id: crypto.randomUUID(), networkId: '', assetType: 'TRANSFORMER', name: 'Transformator TR-10', serialNumber: 'TR-2024-005', manufacturer: 'Siemens', status: 'ACTIVE', installationDate: '2017-11-30', isActive: true }
    ];
  }

  private getMockIncidents(): InfrastructureIncident[] {
    return [
      { id: crypto.randomUUID(), incidentType: 'LEAK', severity: 'CRITICAL', description: 'Scurgere majoră pe conducta principală', status: 'IN_PROGRESS', reportedAt: '2024-03-15T10:30:00', isActive: true },
      { id: crypto.randomUUID(), incidentType: 'MALFUNCTION', severity: 'HIGH', description: 'Pompă defectă stație CP-2', status: 'NEW', reportedAt: '2024-03-18T14:20:00', isActive: true },
      { id: crypto.randomUUID(), incidentType: 'BLOCKAGE', severity: 'MEDIUM', description: 'Canalizare înfundată strada Victoriei', status: 'RESOLVED', reportedAt: '2024-03-10T09:15:00', resolvedAt: '2024-03-11T16:00:00', isActive: true },
      { id: crypto.randomUUID(), incidentType: 'PLANNED_WORK', severity: 'LOW', description: 'Întrerupere programată pentru mentenanță', status: 'CLOSED', reportedAt: '2024-03-01T08:00:00', resolvedAt: '2024-03-01T12:00:00', isActive: true }
    ];
  }
}