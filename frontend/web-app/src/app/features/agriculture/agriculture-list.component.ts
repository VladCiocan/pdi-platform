import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { AgricultureService } from '../../core/services/agriculture.service';
import {
  AgricultureHousehold,
  AgricultureMember,
  AgricultureParcel,
  AgricultureAnimal,
  AgricultureMachine,
  MemberType,
  FamilyRelation,
  ParcelCategory,
  UsageType,
  AnimalType,
  MachineType
} from '../../core/models/agriculture.model';

@Component({
  selector: 'app-agriculture-list',
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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div class="header-content">
          <h1>📋 Registrul Agricol</h1>
          <p>Gestionare gospodării agricole, parcele, animale și utilaje</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openHouseholdDialog()">
            <mat-icon>add</mat-icon> Gospodărie Nouă
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #4caf50;">
              <mat-icon>home</mat-icon>
            </div>
            <div class="stat-value">{{ stats.households }}</div>
            <div class="stat-label">Gospodării</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #2196f3;">
              <mat-icon>grid_on</mat-icon>
            </div>
            <div class="stat-value">{{ stats.parcels }}</div>
            <div class="stat-label">Parcele</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>pets</mat-icon>
            </div>
            <div class="stat-value">{{ stats.animals }}</div>
            <div class="stat-label">Animale</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #9c27b0;">
              <mat-icon>agriculture</mat-icon>
            </div>
            <div class="stat-value">{{ stats.machines }}</div>
            <div class="stat-label">Utilaje</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs with data -->
      <mat-card class="data-card">
        <mat-tab-group animationDuration="200ms" [(selectedIndex)]="selectedTab">
          
          <!-- Households Tab -->
          <mat-tab label="Gospodării">
            <div class="tab-content">
              @if (loading) {
                <div class="loading-container">
                  <mat-spinner diameter="40"></mat-spinner>
                </div>
              } @else if (households.length === 0) {
                <div class="empty-state">
                  <mat-icon>home</mat-icon>
                  <p>Nu aveți gospodării înregistrate</p>
                  <button mat-raised-button color="primary" (click)="openHouseholdDialog()">
                    <mat-icon>add</mat-icon> Adaugă Gospodărie
                  </button>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="households" class="full-width-table">
                    <ng-container matColumnDef="householdCode">
                      <th mat-header-cell *matHeaderCellDef>Cod</th>
                      <td mat-cell *matCellDef="let h">{{ h.householdCode }}</td>
                    </ng-container>
                    <ng-container matColumnDef="ownerName">
                      <th mat-header-cell *matHeaderCellDef>Proprietar</th>
                      <td mat-cell *matCellDef="let h">{{ h.ownerName }}</td>
                    </ng-container>
                    <ng-container matColumnDef="registrationDate">
                      <th mat-header-cell *matHeaderCellDef>Data Înregistrării</th>
                      <td mat-cell *matCellDef="let h">{{ h.registrationDate | date:'dd/MM/yyyy' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let h">
                        <mat-chip [color]="h.isActive ? 'accent' : 'warn'" selected>
                          {{ h.isActive ? 'Activ' : 'Inactiv' }}
                        </mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let h">
                        <button mat-icon-button color="primary" (click)="viewHouseholdDetails(h)">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button color="accent" (click)="openHouseholdDialog(h)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteHousehold(h)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="householdColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: householdColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Parcels Tab -->
          <mat-tab label="Parcele">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openParcelDialog()">
                  <mat-icon>add</mat-icon> Parcelă Nouă
                </button>
              </div>
              @if (parcels.length === 0) {
                <div class="empty-state">
                  <mat-icon>grid_on</mat-icon>
                  <p>Nu aveți parcele înregistrate</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="parcels" class="full-width-table">
                    <ng-container matColumnDef="parcelNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Parcelă</th>
                      <td mat-cell *matCellDef="let p">{{ p.parcelNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="cadastralNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Cadastral</th>
                      <td mat-cell *matCellDef="let p">{{ p.cadastralNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="area">
                      <th mat-header-cell *matHeaderCellDef>Suprafață (ha)</th>
                      <td mat-cell *matCellDef="let p">{{ p.area }} ha</td>
                    </ng-container>
                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Categorie</th>
                      <td mat-cell *matCellDef="let p">
                        <mat-chip>{{ getCategoryLabel(p.category) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="usageType">
                      <th mat-header-cell *matHeaderCellDef>Tip Utilizare</th>
                      <td mat-cell *matCellDef="let p">{{ p.usageType }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let p">
                        <button mat-icon-button color="accent" (click)="openParcelDialog(p)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteParcel(p)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="parcelColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: parcelColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Members Tab -->
          <mat-tab label="Membri">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openMemberDialog()">
                  <mat-icon>add</mat-icon> Membru Nou
                </button>
              </div>
              @if (members.length === 0) {
                <div class="empty-state">
                  <mat-icon>people</mat-icon>
                  <p>Nu aveți membri înregistrați</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="members" class="full-width-table">
                    <ng-container matColumnDef="firstName">
                      <th mat-header-cell *matHeaderCellDef>Nume</th>
                      <td mat-cell *matCellDef="let m">{{ m.firstName }}</td>
                    </ng-container>
                    <ng-container matColumnDef="lastName">
                      <th mat-header-cell *matHeaderCellDef>Prenume</th>
                      <td mat-cell *matCellDef="let m">{{ m.lastName }}</td>
                    </ng-container>
                    <ng-container matColumnDef="cnp">
                      <th mat-header-cell *matHeaderCellDef>CNP</th>
                      <td mat-cell *matCellDef="let m">{{ m.cnp }}</td>
                    </ng-container>
                    <ng-container matColumnDef="type">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let m">
                        <mat-chip>{{ getMemberTypeLabel(m.type) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="relation">
                      <th mat-header-cell *matHeaderCellDef>Relație</th>
                      <td mat-cell *matCellDef="let m">{{ m.relation || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let m">
                        <button mat-icon-button color="accent" (click)="openMemberDialog(m)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteMember(m)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="memberColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: memberColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Animals Tab -->
          <mat-tab label="Animale">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openAnimalDialog()">
                  <mat-icon>add</mat-icon> Animal Nou
                </button>
              </div>
              @if (animals.length === 0) {
                <div class="empty-state">
                  <mat-icon>pets</mat-icon>
                  <p>Nu aveți animale înregistrate</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="animals" class="full-width-table">
                    <ng-container matColumnDef="animalType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let a">
                        <mat-chip>{{ getAnimalTypeLabel(a.animalType) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="species">
                      <th mat-header-cell *matHeaderCellDef>Specie</th>
                      <td mat-cell *matCellDef="let a">{{ a.species }}</td>
                    </ng-container>
                    <ng-container matColumnDef="breed">
                      <th mat-header-cell *matHeaderCellDef>Rasă</th>
                      <td mat-cell *matCellDef="let a">{{ a.breed }}</td>
                    </ng-container>
                    <ng-container matColumnDef="tagNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Ceramică</th>
                      <td mat-cell *matCellDef="let a">{{ a.tagNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="quantity">
                      <th mat-header-cell *matHeaderCellDef>Cantitate</th>
                      <td mat-cell *matCellDef="let a">{{ a.quantity }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let a">
                        <button mat-icon-button color="accent" (click)="openAnimalDialog(a)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteAnimal(a)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="animalColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: animalColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Machines Tab -->
          <mat-tab label="Utilaje">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openMachineDialog()">
                  <mat-icon>add</mat-icon> Utilaj Nou
                </button>
              </div>
              @if (machines.length === 0) {
                <div class="empty-state">
                  <mat-icon>agriculture</mat-icon>
                  <p>Nu aveți utilaje înregistrate</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="machines" class="full-width-table">
                    <ng-container matColumnDef="machineType">
                      <th mat-header-cell *matHeaderCellDef>Tip</th>
                      <td mat-cell *matCellDef="let m">
                        <mat-chip>{{ getMachineTypeLabel(m.machineType) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="registrationNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Înmatriculare</th>
                      <td mat-cell *matCellDef="let m">{{ m.registrationNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="brand">
                      <th mat-header-cell *matHeaderCellDef>Marcă</th>
                      <td mat-cell *matCellDef="let m">{{ m.brand }}</td>
                    </ng-container>
                    <ng-container matColumnDef="model">
                      <th mat-header-cell *matHeaderCellDef>Model</th>
                      <td mat-cell *matCellDef="let m">{{ m.model }}</td>
                    </ng-container>
                    <ng-container matColumnDef="horsePower">
                      <th mat-header-cell *matHeaderCellDef>CP</th>
                      <td mat-cell *matCellDef="let m">{{ m.horsePower }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let m">
                        <button mat-icon-button color="accent" (click)="openMachineDialog(m)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteMachine(m)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="machineColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: machineColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-card>
    </div>

    <!-- Household Dialog -->
    @if (showHouseholdDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingHousehold ? 'Editează' : 'Gospodărie Nouă' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cod Gospodărie</mat-label>
              <input matInput [(ngModel)]="householdForm.householdCode" placeholder="AGR-001">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nume Proprietar</mat-label>
              <input matInput [(ngModel)]="householdForm.ownerName" placeholder="Nume și Prenume">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveHousehold()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Parcel Dialog -->
    @if (showParcelDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingParcel ? 'Editează' : 'Parcelă Nouă' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nr. Parcelă</mat-label>
              <input matInput [(ngModel)]="parcelForm.parcelNumber">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nr. Cadastral</mat-label>
              <input matInput [(ngModel)]="parcelForm.cadastralNumber">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Suprafață (ha)</mat-label>
              <input matInput type="number" [(ngModel)]="parcelForm.area">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Categorie</mat-label>
              <mat-select [(ngModel)]="parcelForm.category">
                @for (cat of parcelCategories; track cat.value) {
                  <mat-option [value]="cat.value">{{ cat.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip Utilizare</mat-label>
              <mat-select [(ngModel)]="parcelForm.usageType">
                @for (usage of usageTypes; track usage.value) {
                  <mat-option [value]="usage.value">{{ usage.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveParcel()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Member Dialog -->
    @if (showMemberDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingMember ? 'Editează' : 'Membru Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Prenume</mat-label>
                <input matInput [(ngModel)]="memberForm.firstName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Nume</mat-label>
                <input matInput [(ngModel)]="memberForm.lastName">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>CNP</mat-label>
                <input matInput [(ngModel)]="memberForm.cnp" maxlength="13">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Telefon</mat-label>
                <input matInput [(ngModel)]="memberForm.phone">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tip Membru</mat-label>
                <mat-select [(ngModel)]="memberForm.type">
                  @for (type of memberTypes; track type.value) {
                    <mat-option [value]="type.value">{{ type.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Relație Familială</mat-label>
                <mat-select [(ngModel)]="memberForm.relation">
                  @for (rel of familyRelations; track rel.value) {
                    <mat-option [value]="rel.value">{{ rel.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveMember()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Animal Dialog -->
    @if (showAnimalDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingAnimal ? 'Editează' : 'Animal Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip Animal</mat-label>
              <mat-select [(ngModel)]="animalForm.animalType">
                @for (type of animalTypes; track type.value) {
                  <mat-option [value]="type.value">{{ type.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Specie</mat-label>
              <input matInput [(ngModel)]="animalForm.species">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rasă</mat-label>
              <input matInput [(ngModel)]="animalForm.breed">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nr. Ceramică</mat-label>
              <input matInput [(ngModel)]="animalForm.tagNumber">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cantitate</mat-label>
              <input matInput type="number" [(ngModel)]="animalForm.quantity">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveAnimal()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Machine Dialog -->
    @if (showMachineDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingMachine ? 'Editează' : 'Utilaj Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tip Utilaj</mat-label>
              <mat-select [(ngModel)]="machineForm.machineType">
                @for (type of machineTypes; track type.value) {
                  <mat-option [value]="type.value">{{ type.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nr. Înmatriculare</mat-label>
              <input matInput [(ngModel)]="machineForm.registrationNumber">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Marcă</mat-label>
              <input matInput [(ngModel)]="machineForm.brand">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Model</mat-label>
              <input matInput [(ngModel)]="machineForm.model">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>CP (Putere)</mat-label>
              <input matInput type="number" [(ngModel)]="machineForm.horsePower">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveMachine()">Salvează</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-content h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .header-content p {
      margin: 4px 0 0;
      color: var(--text-secondary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      color: white;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .data-card {
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 24px;
      min-height: 400px;
    }

    .tab-actions {
      margin-bottom: 16px;
    }

    .table-container {
      overflow-x: auto;
    }

    .full-width-table {
      width: 100%;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: var(--text-secondary);
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin-bottom: 16px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    /* Dialog Styles */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 12px;
      width: 400px;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .dialog-large {
      width: 600px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .dialog-body {
      padding: 24px;
      overflow-y: auto;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .form-row {
        flex-direction: column;
      }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AgricultureListComponent implements OnInit {
  private agricultureService = inject(AgricultureService);
  private snackBar = inject(MatSnackBar);

  // Data
  households: AgricultureHousehold[] = [];
  parcels: AgricultureParcel[] = [];
  members: AgricultureMember[] = [];
  animals: AgricultureAnimal[] = [];
  machines: AgricultureMachine[] = [];

  loading = false;
  selectedTab = 0;

  stats = {
    households: 0,
    parcels: 0,
    animals: 0,
    machines: 0
  };

  // Table columns
  householdColumns = ['householdCode', 'ownerName', 'registrationDate', 'status', 'actions'];
  parcelColumns = ['parcelNumber', 'cadastralNumber', 'area', 'category', 'usageType', 'actions'];
  memberColumns = ['firstName', 'lastName', 'cnp', 'type', 'relation', 'actions'];
  animalColumns = ['animalType', 'species', 'breed', 'tagNumber', 'quantity', 'actions'];
  machineColumns = ['machineType', 'registrationNumber', 'brand', 'model', 'horsePower', 'actions'];

  // Dialog states
  showHouseholdDialog = false;
  showParcelDialog = false;
  showMemberDialog = false;
  showAnimalDialog = false;
  showMachineDialog = false;

  // Editing states
  editingHousehold: AgricultureHousehold | null = null;
  editingParcel: AgricultureParcel | null = null;
  editingMember: AgricultureMember | null = null;
  editingAnimal: AgricultureAnimal | null = null;
  editingMachine: AgricultureMachine | null = null;

  // Form data
  householdForm: Partial<AgricultureHousehold> = this.getEmptyHousehold();
  parcelForm: Partial<AgricultureParcel> = this.getEmptyParcel();
  memberForm: Partial<AgricultureMember> = this.getEmptyMember();
  animalForm: Partial<AgricultureAnimal> = this.getEmptyAnimal();
  machineForm: Partial<AgricultureMachine> = this.getEmptyMachine();

  // Options
  memberTypes = [
    { value: 'OWNER', label: 'Proprietar' },
    { value: 'MEMBER', label: 'Membru' },
    { value: 'TENANT', label: 'Chiriaș' }
  ];

  familyRelations = [
    { value: 'HEAD', label: 'Cap de gospodărie' },
    { value: 'SPOUSE', label: 'Soț/Soție' },
    { value: 'CHILD', label: 'Copil' },
    { value: 'PARENT', label: 'Părinte' },
    { value: 'SIBLING', label: 'Frate/Soră' },
    { value: 'OTHER', label: 'Altă rudenie' }
  ];

  parcelCategories = [
    { value: 'ARABLE', label: 'Arabil' },
    { value: 'PASTURE', label: 'Pășune' },
    { value: 'FOREST', label: 'Forestier' },
    { value: 'VINEYARD', label: 'Vie' },
    { value: 'ORCHARD', label: 'Livadă' },
    { value: 'OTHER', label: 'Altă categorie' }
  ];

  usageTypes = [
    { value: 'OWNED', label: 'Proprietate' },
    { value: 'LEASED', label: 'Arendat' },
    { value: 'RENTED', label: 'Închiriat' },
    { value: 'USED_FREE', label: 'Uzufruct' }
  ];

  animalTypes = [
    { value: 'BOVINE', label: 'Bovine' },
    { value: 'PORCINE', label: 'Porcine' },
    { value: 'OVINE', label: 'Ovine' },
    { value: 'CAPRINE', label: 'Caprine' },
    { value: 'EQUINE', label: 'Ecvine' },
    { value: 'POULTRY', label: 'Păsări' },
    { value: 'RABBIT', label: 'Iepuri' },
    { value: 'BEE', label: 'Albine' },
    { value: 'OTHER', label: 'Altele' }
  ];

  machineTypes = [
    { value: 'TRACTOR', label: 'Tractor' },
    { value: 'COMBINE', label: 'Combină' },
    { value: 'PLOW', label: 'Plug' },
    { value: 'SEEDER', label: 'Semănătoare' },
    { value: 'SPRAYER', label: 'Stropitoare' },
    { value: 'HARVESTER', label: 'Recoltătoare' },
    { value: 'TRAILER', label: 'Remorcă' },
    { value: 'OTHER', label: 'Alt utilaj' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Load all data in parallel
    this.agricultureService.getHouseholds().subscribe({
      next: (data) => {
        this.households = data;
        this.stats.households = data.length;
        this.loading = false;
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.households = [];
        this.loading = false;
      }
    });

    this.agricultureService.getParcels().subscribe({
      next: (data) => {
        this.parcels = data;
        this.stats.parcels = data.length;
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.parcels = [];
      }
    });

    this.agricultureService.getMembers().subscribe({
      next: (data) => this.members = data,
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.members = [];
      }
    });

    this.agricultureService.getAnimals().subscribe({
      next: (data) => {
        this.animals = data;
        this.stats.animals = data.length;
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.animals = [];
      }
    });

    this.agricultureService.getMachines().subscribe({
      next: (data) => {
        this.machines = data;
        this.stats.machines = data.length;
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.machines = [];
      }
    });
  }

  // Household dialog
  openHouseholdDialog(household?: AgricultureHousehold) {
    this.editingHousehold = household || null;
    this.householdForm = household ? { ...household } : this.getEmptyHousehold();
    this.showHouseholdDialog = true;
  }

  saveHousehold() {
    if (this.editingHousehold) {
      this.agricultureService.updateHousehold(this.editingHousehold.id!, this.householdForm).subscribe({
        next: () => {
          this.showSnackBar('Gospodărie actualizată');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          // Mock update
          const index = this.households.findIndex(h => h.id === this.editingHousehold!.id);
          if (index >= 0) this.households[index] = { ...this.households[index], ...this.householdForm };
          this.showSnackBar('Gospodărie actualizată');
          this.closeDialogs();
        }
      });
    } else {
      this.agricultureService.createHousehold(this.householdForm).subscribe({
        next: () => {
          this.showSnackBar('Gospodărie creată');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          // Mock create
          const newHousehold = { 
            ...this.householdForm, 
            id: crypto.randomUUID(),
            householdCode: this.householdForm.householdCode || 'AGR-' + Date.now(),
            ownerName: this.householdForm.ownerName || '',
            isActive: true
          } as AgricultureHousehold;
          this.households.push(newHousehold);
          this.stats.households++;
          this.showSnackBar('Gospodărie creată');
          this.closeDialogs();
        }
      });
    }
  }

  deleteHousehold(household: AgricultureHousehold) {
    if (confirm('Sigur doriți să ștergeți această gospodărie?')) {
      this.agricultureService.deleteHousehold(household.id!).subscribe({
        next: () => {
          this.showSnackBar('Gospodărie ștearsă');
          this.loadData();
        },
        error: () => {
          this.households = this.households.filter(h => h.id !== household.id);
          this.stats.households--;
          this.showSnackBar('Gospodărie ștearsă');
        }
      });
    }
  }

  viewHouseholdDetails(household: AgricultureHousehold) {
    this.selectedTab = 1; // Go to parcels
    this.showSnackBar(`Vizualizare gospodărie: ${household.householdCode}`);
  }

  // Parcel dialog
  openParcelDialog(parcel?: AgricultureParcel) {
    this.editingParcel = parcel || null;
    this.parcelForm = parcel ? { ...parcel } : this.getEmptyParcel();
    this.showParcelDialog = true;
  }

  saveParcel() {
    if (this.editingParcel) {
      this.agricultureService.updateParcel(this.editingParcel.id!, this.parcelForm).subscribe({
        next: () => {
          this.showSnackBar('Parcelă actualizată');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const index = this.parcels.findIndex(p => p.id === this.editingParcel!.id);
          if (index >= 0) this.parcels[index] = { ...this.parcels[index], ...this.parcelForm };
          this.showSnackBar('Parcelă actualizată');
          this.closeDialogs();
        }
      });
    } else {
      this.agricultureService.createParcel(this.parcelForm).subscribe({
        next: () => {
          this.showSnackBar('Parcelă creată');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const newParcel = { 
            ...this.parcelForm, 
            id: crypto.randomUUID(),
            parcelNumber: this.parcelForm.parcelNumber || 'P-' + Date.now(),
            category: this.parcelForm.category || 'ARABLE',
            isActive: true
          } as AgricultureParcel;
          this.parcels.push(newParcel);
          this.stats.parcels++;
          this.showSnackBar('Parcelă creată');
          this.closeDialogs();
        }
      });
    }
  }

  deleteParcel(parcel: AgricultureParcel) {
    if (confirm('Sigur doriți să ștergeți această parcelă?')) {
      this.agricultureService.deleteParcel(parcel.id!).subscribe({
        next: () => {
          this.showSnackBar('Parcelă ștearsă');
          this.loadData();
        },
        error: () => {
          this.parcels = this.parcels.filter(p => p.id !== parcel.id);
          this.stats.parcels--;
          this.showSnackBar('Parcelă ștearsă');
        }
      });
    }
  }

  // Member dialog
  openMemberDialog(member?: AgricultureMember) {
    this.editingMember = member || null;
    this.memberForm = member ? { ...member } : this.getEmptyMember();
    this.showMemberDialog = true;
  }

  saveMember() {
    if (this.editingMember) {
      this.agricultureService.updateMember(this.editingMember.id!, this.memberForm).subscribe({
        next: () => {
          this.showSnackBar('Membru actualizat');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const index = this.members.findIndex(m => m.id === this.editingMember!.id);
          if (index >= 0) this.members[index] = { ...this.members[index], ...this.memberForm };
          this.showSnackBar('Membru actualizat');
          this.closeDialogs();
        }
      });
    } else {
      this.agricultureService.createMember(this.memberForm).subscribe({
        next: () => {
          this.showSnackBar('Membru creat');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const newMember = { 
            ...this.memberForm, 
            id: crypto.randomUUID(),
            firstName: this.memberForm.firstName || '',
            lastName: this.memberForm.lastName || '',
            type: this.memberForm.type || 'MEMBER',
            isActive: true
          } as AgricultureMember;
          this.members.push(newMember);
          this.showSnackBar('Membru creat');
          this.closeDialogs();
        }
      });
    }
  }

  deleteMember(member: AgricultureMember) {
    if (confirm('Sigur doriți să ștergeți acest membru?')) {
      this.agricultureService.deleteMember(member.id!).subscribe({
        next: () => {
          this.showSnackBar('Membru șters');
          this.loadData();
        },
        error: () => {
          this.members = this.members.filter(m => m.id !== member.id);
          this.showSnackBar('Membru șters');
        }
      });
    }
  }

  // Animal dialog
  openAnimalDialog(animal?: AgricultureAnimal) {
    this.editingAnimal = animal || null;
    this.animalForm = animal ? { ...animal } : this.getEmptyAnimal();
    this.showAnimalDialog = true;
  }

  saveAnimal() {
    if (this.editingAnimal) {
      this.agricultureService.updateAnimal(this.editingAnimal.id!, this.animalForm).subscribe({
        next: () => {
          this.showSnackBar('Animal actualizat');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const index = this.animals.findIndex(a => a.id === this.editingAnimal!.id);
          if (index >= 0) this.animals[index] = { ...this.animals[index], ...this.animalForm };
          this.showSnackBar('Animal actualizat');
          this.closeDialogs();
        }
      });
    } else {
      this.agricultureService.createAnimal(this.animalForm).subscribe({
        next: () => {
          this.showSnackBar('Animal creat');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const newAnimal = { 
            ...this.animalForm, 
            id: crypto.randomUUID(),
            animalType: this.animalForm.animalType || 'BOVINE',
            quantity: this.animalForm.quantity || 1,
            isActive: true
          } as AgricultureAnimal;
          this.animals.push(newAnimal);
          this.stats.animals++;
          this.showSnackBar('Animal creat');
          this.closeDialogs();
        }
      });
    }
  }

  deleteAnimal(animal: AgricultureAnimal) {
    if (confirm('Sigur doriți să ștergeți acest animal?')) {
      this.agricultureService.deleteAnimal(animal.id!).subscribe({
        next: () => {
          this.showSnackBar('Animal șters');
          this.loadData();
        },
        error: () => {
          this.animals = this.animals.filter(a => a.id !== animal.id);
          this.stats.animals--;
          this.showSnackBar('Animal șters');
        }
      });
    }
  }

  // Machine dialog
  openMachineDialog(machine?: AgricultureMachine) {
    this.editingMachine = machine || null;
    this.machineForm = machine ? { ...machine } : this.getEmptyMachine();
    this.showMachineDialog = true;
  }

  saveMachine() {
    if (this.editingMachine) {
      this.agricultureService.updateMachine(this.editingMachine.id!, this.machineForm).subscribe({
        next: () => {
          this.showSnackBar('Utilaj actualizat');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const index = this.machines.findIndex(m => m.id === this.editingMachine!.id);
          if (index >= 0) this.machines[index] = { ...this.machines[index], ...this.machineForm };
          this.showSnackBar('Utilaj actualizat');
          this.closeDialogs();
        }
      });
    } else {
      this.agricultureService.createMachine(this.machineForm).subscribe({
        next: () => {
          this.showSnackBar('Utilaj creat');
          this.loadData();
          this.closeDialogs();
        },
        error: () => {
          const newMachine = { 
            ...this.machineForm, 
            id: crypto.randomUUID(),
            machineType: this.machineForm.machineType || 'TRACTOR',
            isActive: true
          } as AgricultureMachine;
          this.machines.push(newMachine);
          this.stats.machines++;
          this.showSnackBar('Utilaj creat');
          this.closeDialogs();
        }
      });
    }
  }

  deleteMachine(machine: AgricultureMachine) {
    if (confirm('Sigur doriți să ștergeți acest utilaj?')) {
      this.agricultureService.deleteMachine(machine.id!).subscribe({
        next: () => {
          this.showSnackBar('Utilaj șters');
          this.loadData();
        },
        error: () => {
          this.machines = this.machines.filter(m => m.id !== machine.id);
          this.stats.machines--;
          this.showSnackBar('Utilaj șters');
        }
      });
    }
  }

  closeDialogs() {
    this.showHouseholdDialog = false;
    this.showParcelDialog = false;
    this.showMemberDialog = false;
    this.showAnimalDialog = false;
    this.showMachineDialog = false;
    this.editingHousehold = null;
    this.editingParcel = null;
    this.editingMember = null;
    this.editingAnimal = null;
    this.editingMachine = null;
  }

  // Labels
  getCategoryLabel(category: ParcelCategory): string {
    return this.parcelCategories.find(c => c.value === category)?.label || category;
  }

  getMemberTypeLabel(type: MemberType): string {
    return this.memberTypes.find(t => t.value === type)?.label || type;
  }

  getAnimalTypeLabel(type: AnimalType): string {
    return this.animalTypes.find(t => t.value === type)?.label || type;
  }

  getMachineTypeLabel(type: MachineType): string {
    return this.machineTypes.find(t => t.value === type)?.label || type;
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }

  // Empty form helpers
  private getEmptyHousehold() {
    return {
      householdCode: '',
      ownerId: '',
      ownerName: '',
      addressId: '',
      registrationDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
  }

  private getEmptyParcel() {
    return {
      parcelNumber: '',
      cadastralNumber: '',
      landRegistryNumber: '',
      category: 'ARABLE' as ParcelCategory,
      usageType: 'OWNED' as UsageType,
      area: 0,
      isActive: true
    };
  }

  private getEmptyMember() {
    return {
      householdId: '',
      firstName: '',
      lastName: '',
      cnp: '',
      type: 'MEMBER' as MemberType,
      relation: 'OTHER' as FamilyRelation,
      isActive: true
    };
  }

  private getEmptyAnimal() {
    return {
      householdId: '',
      animalType: 'BOVINE' as AnimalType,
      species: '',
      breed: '',
      quantity: 1,
      isActive: true
    };
  }

  private getEmptyMachine() {
    return {
      householdId: '',
      machineType: 'TRACTOR' as MachineType,
      brand: '',
      model: '',
      horsePower: 0,
      isActive: true
    };
  }

}