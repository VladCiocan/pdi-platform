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
import { MatStepperModule } from '@angular/material/stepper';
import { catchError, of } from 'rxjs';
import { UrbanismService } from '../../core/services/urbanism.service';
import {
  UrbanismRegister,
  UrbanismUTR,
  CertificateUrbanism,
  Authorization,
  CertificateNomenclature,
  RegisterType,
  RegisterStatus,
  CUStatus,
  ACStatus,
  AuthorizationType,
  CNSStatus
} from '../../core/models/urbanism.model';

@Component({
  selector: 'app-urbanism-list',
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
    MatStepperModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div class="header-content">
          <h1>🏙️ Urbanism</h1>
          <p>Certificate de urbanism, autorizații de construire și registrul urbanistic</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openCUDialog()">
            <mat-icon>add</mat-icon> Certificat Urbanism
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #2196f3;">
              <mat-icon>folder</mat-icon>
            </div>
            <div class="stat-value">{{ stats.registers }}</div>
            <div class="stat-label">Registre</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #4caf50;">
              <mat-icon>map</mat-icon>
            </div>
            <div class="stat-value">{{ stats.utrs }}</div>
            <div class="stat-label">UTR-uri</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-value">{{ stats.certificates }}</div>
            <div class="stat-label">Certificate CU</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #9c27b0;">
              <mat-icon>construction</mat-icon>
            </div>
            <div class="stat-value">{{ stats.authorizations }}</div>
            <div class="stat-label">Autorizații AC</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-card class="data-card">
        <mat-tab-group animationDuration="200ms" [(selectedIndex)]="selectedTab">
          
          <!-- UTR Tab -->
          <mat-tab label="UTR">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openUTRDialog()">
                  <mat-icon>add</mat-icon> UTR Nou
                </button>
              </div>
              @if (utrs.length === 0) {
                <div class="empty-state">
                  <mat-icon>map</mat-icon>
                  <p>Nu aveți unități teritoriale de referință</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="utrs" class="full-width-table">
                    <ng-container matColumnDef="code">
                      <th mat-header-cell *matHeaderCellDef>Cod</th>
                      <td mat-cell *matCellDef="let u">{{ u.code }}</td>
                    </ng-container>
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Denumire</th>
                      <td mat-cell *matCellDef="let u">{{ u.name }}</td>
                    </ng-container>
                    <ng-container matColumnDef="zoningType">
                      <th mat-header-cell *matHeaderCellDef>Zonificare</th>
                      <td mat-cell *matCellDef="let u">{{ u.zoningType || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="pot">
                      <th mat-header-cell *matHeaderCellDef>POT %</th>
                      <td mat-cell *matCellDef="let u">{{ u.potPercentage || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="cut">
                      <th mat-header-cell *matHeaderCellDef>CUT</th>
                      <td mat-cell *matCellDef="let u">{{ u.cutIndex || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let u">
                        <button mat-icon-button color="accent" (click)="openUTRDialog(u)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="utrColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: utrColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Certificates (CU) Tab -->
          <mat-tab label="Certificate Urbanism">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openCUDialog()">
                  <mat-icon>add</mat-icon> Certificat Nou
                </button>
              </div>
              @if (certificates.length === 0) {
                <div class="empty-state">
                  <mat-icon>description</mat-icon>
                  <p>Nu aveți certificate de urbanism</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="certificates" class="full-width-table">
                    <ng-container matColumnDef="cuNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Certificat</th>
                      <td mat-cell *matCellDef="let c">{{ c.cuNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="applicantId">
                      <th mat-header-cell *matHeaderCellDef> solicitant</th>
                      <td mat-cell *matCellDef="let c">{{ c.applicantId | slice:0:8 }}...</td>
                    </ng-container>
                    <ng-container matColumnDef="applicationDate">
                      <th mat-header-cell *matHeaderCellDef>Data Cererii</th>
                      <td mat-cell *matCellDef="let c">{{ c.applicationDate | date:'dd/MM/yyyy' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let c">
                        <mat-chip [color]="getCUStatusColor(c.status)" selected>{{ getCULabel(c.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="taxPaid">
                      <th mat-header-cell *matHeaderCellDef>Taxă</th>
                      <td mat-cell *matCellDef="let c">
                        <mat-chip [color]="c.taxPaid ? 'accent' : 'warn'" selected>
                          {{ c.taxPaid ? 'Achitată' : 'Neachitată' }}
                        </mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let c">
                        <button mat-icon-button color="accent" (click)="openCUDialog(c)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="primary" (click)="createAuthorizationFromCU(c)">
                          <mat-icon>construction</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="cuColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: cuColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Authorizations (AC) Tab -->
          <mat-tab label="Autorizații Construire">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openACDialog()">
                  <mat-icon>add</mat-icon> Autorizație Nouă
                </button>
              </div>
              @if (authorizations.length === 0) {
                <div class="empty-state">
                  <mat-icon>construction</mat-icon>
                  <p>Nu aveți autorizații de construire</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="authorizations" class="full-width-table">
                    <ng-container matColumnDef="acNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Autorizație</th>
                      <td mat-cell *matCellDef="let a">{{ a.acNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="authorizationType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let a">
                        <mat-chip>{{ a.authorizationType === 'CONSTRUIRE' ? 'Construire' : 'Desființare' }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="applicationDate">
                      <th mat-header-cell *matHeaderCellDef>Data Cererii</th>
                      <td mat-cell *matCellDef="let a">{{ a.applicationDate | date:'dd/MM/yyyy' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let a">
                        <mat-chip [color]="getACStatusColor(a.status)" selected>{{ getACLabel(a.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="builtArea">
                      <th mat-header-cell *matHeaderCellDef>Supr. Const.</th>
                      <td mat-cell *matCellDef="let a">{{ a.builtArea }} mp</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let a">
                        <button mat-icon-button color="accent" (click)="openACDialog(a)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="acColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: acColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Registers Tab -->
          <mat-tab label="Registre">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openRegisterDialog()">
                  <mat-icon>add</mat-icon> Registru Nou
                </button>
              </div>
              @if (registers.length === 0) {
                <div class="empty-state">
                  <mat-icon>folder</mat-icon>
                  <p>Nu aveți registre urbanistice</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="registers" class="full-width-table">
                    <ng-container matColumnDef="registerNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Registru</th>
                      <td mat-cell *matCellDef="let r">{{ r.registerNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="registerType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let r">
                        <mat-chip>{{ getRegisterTypeLabel(r.registerType) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="sessionDate">
                      <th mat-header-cell *matHeaderCellDef>Data Ședinței</th>
                      <td mat-cell *matCellDef="let r">{{ r.sessionDate | date:'dd/MM/yyyy' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let r">
                        <mat-chip>{{ r.status }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="totalRecords">
                      <th mat-header-cell *matHeaderCellDef>Înregistrări</th>
                      <td mat-cell *matCellDef="let r">{{ r.totalRecords }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let r">
                        <button mat-icon-button color="accent" (click)="openRegisterDialog(r)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="registerColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: registerColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-card>
    </div>

    <!-- CU Dialog -->
    @if (showCUDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingCU ? 'Editează' : 'Certificat Urbanism' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nr. Certificat</mat-label>
                <input matInput [(ngModel)]="cuForm.cuNumber">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Tip Certificat</mat-label>
                <mat-select [(ngModel)]="cuForm.urbanismCertificateType">
                  <mat-option value="PUZ">PUZ</mat-option>
                  <mat-option value="PUD">PUD</mat-option>
                  <mat-option value=" Certificate">Certificat</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data Cererii</mat-label>
                <input matInput type="date" [(ngModel)]="cuForm.applicationDate">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="cuForm.status">
                  @for (s of cuStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Scopul Certificatului</mat-label>
              <textarea matInput [(ngModel)]="cuForm.purpose" rows="3"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Regim Juridic</mat-label>
              <textarea matInput [(ngModel)]="cuForm.legalRegime" rows="2"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Condiții</mat-label>
              <textarea matInput [(ngModel)]="cuForm.conditions" rows="2"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Taxă</mat-label>
                <input matInput type="number" [(ngModel)]="cuForm.taxAmount">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Taxă Achitată</mat-label>
                <mat-select [(ngModel)]="cuForm.taxPaid">
                  <mat-option [value]="true">Da</mat-option>
                  <mat-option [value]="false">Nu</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveCU()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- AC Dialog -->
    @if (showACDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingAC ? 'Editează' : 'Autorizație Construire' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nr. Autorizație</mat-label>
                <input matInput [(ngModel)]="acForm.acNumber">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Tip Autorizație</mat-label>
                <mat-select [(ngModel)]="acForm.authorizationType">
                  <mat-option value="CONSTRUIRE">Construire</mat-option>
                  <mat-option value="DESFIINTARE">Desființare</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data Cererii</mat-label>
                <input matInput type="date" [(ngModel)]="acForm.applicationDate">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="acForm.status">
                  @for (s of acStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tip Construcție</mat-label>
                <input matInput [(ngModel)]="acForm.constructionType">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Destinație</mat-label>
                <input matInput [(ngModel)]="acForm.destination">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Suprafață Construită (mp)</mat-label>
                <input matInput type="number" [(ngModel)]="acForm.builtArea">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Suprafață Totală (mp)</mat-label>
                <input matInput type="number" [(ngModel)]="acForm.totalArea">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Înălțime (m)</mat-label>
                <input matInput type="number" [(ngModel)]="acForm.height">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Etaje</mat-label>
                <input matInput type="number" [(ngModel)]="acForm.floors">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Valoare Construcție</mat-label>
              <input matInput type="number" [(ngModel)]="acForm.constructionValue">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Taxă</mat-label>
                <input matInput type="number" [(ngModel)]="acForm.taxAmount">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Taxă Achitată</mat-label>
                <mat-select [(ngModel)]="acForm.taxPaid">
                  <mat-option [value]="true">Da</mat-option>
                  <mat-option [value]="false">Nu</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveAC()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- UTR Dialog -->
    @if (showUTRDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingUTR ? 'Editează' : 'Unitate Teritorială' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cod UTR</mat-label>
                <input matInput [(ngModel)]="utrForm.code">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Denumire</mat-label>
                <input matInput [(ngModel)]="utrForm.name">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip Zonificare</mat-label>
              <input matInput [(ngModel)]="utrForm.zoningType">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>POT (%)</mat-label>
                <input matInput type="number" [(ngModel)]="utrForm.potPercentage">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>CUT</mat-label>
                <input matInput type="number" [(ngModel)]="utrForm.cutIndex">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Înălțime Max (m)</mat-label>
                <input matInput type="number" [(ngModel)]="utrForm.maxBuildHeight">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Etaje Max</mat-label>
                <input matInput type="number" [(ngModel)]="utrForm.maxFloors">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Regulament</mat-label>
              <textarea matInput [(ngModel)]="utrForm.regulations" rows="3"></textarea>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveUTR()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Register Dialog -->
    @if (showRegisterDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingRegister ? 'Editează' : 'Registru Urbanistic' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nr. Registru</mat-label>
              <input matInput [(ngModel)]="registerForm.registerNumber">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip Registru</mat-label>
              <mat-select [(ngModel)]="registerForm.registerType">
                @for (t of registerTypes; track t.value) {
                  <mat-option [value]="t.value">{{ t.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data Ședinței</mat-label>
              <input matInput type="date" [(ngModel)]="registerForm.sessionDate">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="registerForm.status">
                @for (s of registerStatuses; track s.value) {
                  <mat-option [value]="s.value">{{ s.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Observații</mat-label>
              <textarea matInput [(ngModel)]="registerForm.observations" rows="2"></textarea>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveRegister()">Salvează</button>
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
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon mat-icon { color: white; }
    .stat-value { font-size: 28px; font-weight: 600; }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .data-card { margin-bottom: 24px; }
    .tab-content { padding: 24px; min-height: 400px; }
    .tab-actions { margin-bottom: 16px; }
    .table-container { overflow-x: auto; }
    .full-width-table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    .empty-state p { margin-bottom: 16px; }
    
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 450px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }
    .dialog-large { width: 600px; }
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
export class UrbanismListComponent implements OnInit {
  private urbanismService = inject(UrbanismService);
  private snackBar = inject(MatSnackBar);

  // Data
  registers: UrbanismRegister[] = [];
  utrs: UrbanismUTR[] = [];
  certificates: CertificateUrbanism[] = [];
  authorizations: Authorization[] = [];
  nomenclatures: CertificateNomenclature[] = [];

  selectedTab = 0;

  stats = {
    registers: 0,
    utrs: 0,
    certificates: 0,
    authorizations: 0
  };

  // Table columns
  utrColumns = ['code', 'name', 'zoningType', 'pot', 'cut', 'actions'];
  cuColumns = ['cuNumber', 'applicantId', 'applicationDate', 'status', 'taxPaid', 'actions'];
  acColumns = ['acNumber', 'authorizationType', 'applicationDate', 'status', 'builtArea', 'actions'];
  registerColumns = ['registerNumber', 'registerType', 'sessionDate', 'status', 'totalRecords', 'actions'];

  // Dialog states
  showCUDialog = false;
  showACDialog = false;
  showUTRDialog = false;
  showRegisterDialog = false;

  editingCU: CertificateUrbanism | null = null;
  editingAC: Authorization | null = null;
  editingUTR: UrbanismUTR | null = null;
  editingRegister: UrbanismRegister | null = null;

  // Forms
  cuForm: Partial<CertificateUrbanism> = this.getEmptyCU();
  acForm: Partial<Authorization> = this.getEmptyAC();
  utrForm: Partial<UrbanismUTR> = this.getEmptyUTR();
  registerForm: Partial<UrbanismRegister> = this.getEmptyRegister();

  // Options
  cuStatuses = [
    { value: 'IN_PROGRESS', label: 'În Lucru' },
    { value: 'PENDING_TAX', label: 'În Așteptare Taxă' },
    { value: 'ISSUED', label: 'Emis' },
    { value: 'EXPIRED', label: 'Expirat' },
    { value: 'CANCELLED', label: 'Anulat' }
  ];

  acStatuses = [
    { value: 'IN_PROGRESS', label: 'În Lucru' },
    { value: 'PENDING_TAX', label: 'În Așteptare Taxă' },
    { value: 'ISSUED', label: 'Emis' },
    { value: 'IN_EXECUTION', label: 'În Execuție' },
    { value: 'COMPLETED', label: 'Finalizat' },
    { value: 'RECEIVED', label: 'Recepționat' },
    { value: 'EXPIRED', label: 'Expirat' },
    { value: 'CANCELLED', label: 'Anulat' }
  ];

  registerTypes = [
    { value: 'MINUTES', label: 'Procese Verbale' },
    { value: 'CU', label: 'Certificate Urbanism' },
    { value: 'AC_AD', label: 'Autorizații Construire' },
    { value: 'CNS', label: 'Nomenclatură Stradală' }
  ];

  registerStatuses = [
    { value: 'OPEN', label: 'Deschis' },
    { value: 'CLOSED', label: 'Închis' },
    { value: 'ARCHIVED', label: 'Arhivat' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.urbanismService.getUTRs().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as UrbanismUTR[]); })
    ).subscribe((data) => {
      this.utrs = data;
      this.stats.utrs = data.length;
    });

    this.urbanismService.getCertificates().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as CertificateUrbanism[]); })
    ).subscribe((data) => {
      this.certificates = data;
      this.stats.certificates = data.length;
    });

    this.urbanismService.getAuthorizations().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as Authorization[]); })
    ).subscribe((data) => {
      this.authorizations = data;
      this.stats.authorizations = data.length;
    });

    this.urbanismService.getRegisters().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as UrbanismRegister[]); })
    ).subscribe((data) => {
      this.registers = data;
      this.stats.registers = data.length;
    });
  }

  // CU Dialog
  openCUDialog(cu?: CertificateUrbanism) {
    this.editingCU = cu || null;
    this.cuForm = cu ? { ...cu } : this.getEmptyCU();
    this.showCUDialog = true;
  }

  saveCU() {
    if (this.editingCU) {
      this.showSnackBar('Certificat actualizat');
    } else {
      const newCU = { ...this.cuForm, id: crypto.randomUUID() } as CertificateUrbanism;
      this.certificates.push(newCU);
      this.stats.certificates++;
      this.showSnackBar('Certificat creat');
    }
    this.closeDialogs();
  }

  createAuthorizationFromCU(cu: CertificateUrbanism) {
    this.selectedTab = 2;
    this.openACDialog();
    this.acForm.cuId = cu.id;
    this.showSnackBar('Creați autorizație pe baza certificatului ' + cu.cuNumber);
  }

  // AC Dialog
  openACDialog(ac?: Authorization) {
    this.editingAC = ac || null;
    this.acForm = ac ? { ...ac } : this.getEmptyAC();
    this.showACDialog = true;
  }

  saveAC() {
    if (this.editingAC) {
      this.showSnackBar('Autorizație actualizată');
    } else {
      const newAC = { ...this.acForm, id: crypto.randomUUID() } as Authorization;
      this.authorizations.push(newAC);
      this.stats.authorizations++;
      this.showSnackBar('Autorizație creată');
    }
    this.closeDialogs();
  }

  // UTR Dialog
  openUTRDialog(utr?: UrbanismUTR) {
    this.editingUTR = utr || null;
    this.utrForm = utr ? { ...utr } : this.getEmptyUTR();
    this.showUTRDialog = true;
  }

  saveUTR() {
    if (this.editingUTR) {
      this.showSnackBar('UTR actualizat');
    } else {
      const newUTR = { ...this.utrForm, id: crypto.randomUUID() } as UrbanismUTR;
      this.utrs.push(newUTR);
      this.stats.utrs++;
      this.showSnackBar('UTR creat');
    }
    this.closeDialogs();
  }

  // Register Dialog
  openRegisterDialog(reg?: UrbanismRegister) {
    this.editingRegister = reg || null;
    this.registerForm = reg ? { ...reg } : this.getEmptyRegister();
    this.showRegisterDialog = true;
  }

  saveRegister() {
    if (this.editingRegister) {
      this.showSnackBar('Registru actualizat');
    } else {
      const newReg = { ...this.registerForm, id: crypto.randomUUID() } as UrbanismRegister;
      this.registers.push(newReg);
      this.stats.registers++;
      this.showSnackBar('Registru creat');
    }
    this.closeDialogs();
  }

  closeDialogs() {
    this.showCUDialog = false;
    this.showACDialog = false;
    this.showUTRDialog = false;
    this.showRegisterDialog = false;
    this.editingCU = null;
    this.editingAC = null;
    this.editingUTR = null;
    this.editingRegister = null;
  }

  // Labels
  getCULabel(status: CUStatus): string {
    return this.cuStatuses.find(s => s.value === status)?.label || status;
  }

  getCUStatusColor(status: CUStatus): string {
    if (status === 'ISSUED') return 'accent';
    if (status === 'CANCELLED' || status === 'EXPIRED') return 'warn';
    return '';
  }

  getACLabel(status: ACStatus): string {
    return this.acStatuses.find(s => s.value === status)?.label || status;
  }

  getACStatusColor(status: ACStatus): string {
    if (status === 'ISSUED' || status === 'RECEIVED') return 'accent';
    if (status === 'CANCELLED' || status === 'EXPIRED') return 'warn';
    return '';
  }

  getRegisterTypeLabel(type: RegisterType): string {
    return this.registerTypes.find(t => t.value === type)?.label || type;
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }

  private getEmptyCU() {
    return {
      cuNumber: '',
      applicantId: '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'IN_PROGRESS' as CUStatus,
      taxPaid: false
    };
  }

  private getEmptyAC() {
    return {
      acNumber: '',
      applicantId: '',
      authorizationType: 'CONSTRUIRE' as AuthorizationType,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'IN_PROGRESS' as ACStatus,
      taxPaid: false
    };
  }

  private getEmptyUTR() {
    return {
      code: '',
      name: '',
      isActive: true
    };
  }

  private getEmptyRegister() {
    return {
      registerType: 'CU' as RegisterType,
      status: 'OPEN' as RegisterStatus,
      isActive: true
    };
  }

}