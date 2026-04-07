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
import { MatDividerModule } from '@angular/material/divider';
import { catchError, of } from 'rxjs';
import { ErpService } from '../../core/services/erp.service';
import {
  ErpEmployee,
  ErpPayroll,
  ErpAccountingEntry,
  ErpBudget,
  ErpInventoryItem,
  ErpFixedAsset,
  EmploymentType,
  EmployeeStatus,
  PayrollStatus,
  BudgetStatus,
  InventoryMethod,
  ItemStatus,
  FixedAssetStatus
} from '../../core/models/erp.model';

@Component({
  selector: 'app-erp-list',
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
    MatDividerModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div class="header-content">
          <h1>📊 ERP</h1>
          <p>Contabilitate, Bugete, Resurse Umane, Inventar</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openEmployeeDialog()">
            <mat-icon>person_add</mat-icon> Angajat Nou
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #2196f3;">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-value">{{ stats.employees }}</div>
            <div class="stat-label">Angajați</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #4caf50;">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-value">{{ stats.payroll | number:'1.0-0' }} lei</div>
            <div class="stat-label">Plată lunară</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>account_balance</mat-icon>
            </div>
            <div class="stat-value">{{ stats.budgetUtilization }}%</div>
            <div class="stat-label">Buget utilizat</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #9c27b0;">
              <mat-icon>inventory</mat-icon>
            </div>
            <div class="stat-value">{{ stats.inventoryValue | number:'1.0-0' }} lei</div>
            <div class="stat-label">Valoare stoc</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-card class="data-card">
        <mat-tab-group animationDuration="200ms" [(selectedIndex)]="selectedTab">
          
          <!-- Employees Tab -->
          <mat-tab label="👥 Angajați">
            <div class="tab-content">
              <div class="tab-actions">
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Departament</mat-label>
                  <mat-select [(ngModel)]="filterDepartment" (selectionChange)="filterEmployees()">
                    <mat-option value="">Toate</mat-option>
                    <mat-option value="IT">IT</mat-option>
                    <mat-option value="Finance">Finance</mat-option>
                    <mat-option value="HR">HR</mat-option>
                    <mat-option value="Operations">Operations</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="openEmployeeDialog()">
                  <mat-icon>add</mat-icon> Angajat
                </button>
              </div>
              @if (filteredEmployees.length === 0) {
                <div class="empty-state">
                  <mat-icon>people</mat-icon>
                  <p>Nu aveți angajați înregistrați</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="filteredEmployees" class="full-width-table">
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Nume</th>
                      <td mat-cell *matCellDef="let e">{{ e.firstName }} {{ e.lastName }}</td>
                    </ng-container>
                    <ng-container matColumnDef="cnp">
                      <th mat-header-cell *matHeaderCellDef>CNP</th>
                      <td mat-cell *matCellDef="let e">{{ e.cnp }}</td>
                    </ng-container>
                    <ng-container matColumnDef="position">
                      <th mat-header-cell *matHeaderCellDef>Post</th>
                      <td mat-cell *matCellDef="let e">{{ e.position || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="department">
                      <th mat-header-cell *matHeaderCellDef>Departament</th>
                      <td mat-cell *matCellDef="let e">{{ e.department || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let e">
                        <mat-chip [color]="getEmployeeStatusColor(e.status)" selected>{{ getEmployeeStatusLabel(e.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let e">
                        <button mat-icon-button color="accent" (click)="openEmployeeDialog(e)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="employeeColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: employeeColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Budget Tab -->
          <mat-tab label="📈 Bugete">
            <div class="tab-content">
              <div class="tab-actions">
                <mat-form-field appearance="outline">
                  <mat-label>An</mat-label>
                  <mat-select [(ngModel)]="filterYear" (selectionChange)="filterBudgets()">
                    <mat-option [value]="2024">2024</mat-option>
                    <mat-option [value]="2023">2023</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="openBudgetDialog()">
                  <mat-icon>add</mat-icon> Buget
                </button>
              </div>
              @if (budgets.length === 0) {
                <div class="empty-state">
                  <mat-icon>account_balance</mat-icon>
                  <p>Nu aveți bugete înregistrate</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="budgets" class="full-width-table">
                    <ng-container matColumnDef="classificationCode">
                      <th mat-header-cell *matHeaderCellDef>Cod</th>
                      <td mat-cell *matCellDef="let b">{{ b.classificationCode }}</td>
                    </ng-container>
                    <ng-container matColumnDef="chapter">
                      <th mat-header-cell *matHeaderCellDef>Capitol</th>
                      <td mat-cell *matCellDef="let b">{{ b.chapter }}</td>
                    </ng-container>
                    <ng-container matColumnDef="article">
                      <th mat-header-cell *matHeaderCellDef>Articol</th>
                      <td mat-cell *matCellDef="let b">{{ b.article }}</td>
                    </ng-container>
                    <ng-container matColumnDef="authorizedCredit">
                      <th mat-header-cell *matHeaderCellDef>Credite Autorizate</th>
                      <td mat-cell *matCellDef="let b">{{ b.authorizedCredit | number:'1.2-2' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="revisedCredit">
                      <th mat-header-cell *matHeaderCellDef>Credite Revizuite</th>
                      <td mat-cell *matCellDef="let b">{{ b.revisedCredit | number:'1.2-2' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let b">
                        <mat-chip [color]="getBudgetStatusColor(b.status)" selected>{{ getBudgetStatusLabel(b.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let b">
                        <button mat-icon-button color="accent" (click)="openBudgetDialog(b)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="budgetColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: budgetColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Accounting Tab -->
          <mat-tab label="📒 Contabilitate">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openAccountingDialog()">
                  <mat-icon>add</mat-icon> Înregistrare
                </button>
              </div>
              @if (accountingEntries.length === 0) {
                <div class="empty-state">
                  <mat-icon>receipt</mat-icon>
                  <p>Nu aveți înregistrări contabile</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="accountingEntries" class="full-width-table">
                    <ng-container matColumnDef="entryDate">
                      <th mat-header-cell *matHeaderCellDef>Data</th>
                      <td mat-cell *matCellDef="let a">{{ a.entryDate | date:'dd/MM/yyyy' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="documentNumber">
                      <th mat-header-cell *matHeaderCellDef>Nr. Document</th>
                      <td mat-cell *matCellDef="let a">{{ a.documentNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="description">
                      <th mat-header-cell *matHeaderCellDef>Descriere</th>
                      <td mat-cell *matCellDef="let a">{{ a.description | slice:0:40 }}{{ a.description && a.description.length > 40 ? '...' : '' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="totalDebit">
                      <th mat-header-cell *matHeaderCellDef>Debit</th>
                      <td mat-cell *matCellDef="let a">{{ a.totalDebit | number:'1.2-2' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="totalCredit">
                      <th mat-header-cell *matHeaderCellDef>Credit</th>
                      <td mat-cell *matCellDef="let a">{{ a.totalCredit | number:'1.2-2' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="isPosted">
                      <th mat-header-cell *matHeaderCellDef>Postat</th>
                      <td mat-cell *matCellDef="let a">
                        <mat-chip [color]="a.isPosted ? 'accent' : 'warn'" selected>{{ a.isPosted ? 'Da' : 'Nu' }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let a">
                        @if (!a.isPosted) {
                          <button mat-icon-button color="primary" (click)="postEntry(a)">
                            <mat-icon>check</mat-icon>
                          </button>
                        }
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="accountingColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: accountingColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Inventory Tab -->
          <mat-tab label="📦 Inventar">
            <div class="tab-content">
              <div class="tab-actions">
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Categorie</mat-label>
                  <mat-select [(ngModel)]="filterCategory" (selectionChange)="filterInventory()">
                    <mat-option value="">Toate</mat-option>
                    <mat-option value="Electronics">Electronice</mat-option>
                    <mat-option value="Furniture">Mobilier</mat-option>
                    <mat-option value="Supplies">Consumabile</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="openInventoryDialog()">
                  <mat-icon>add</mat-icon> Produs
                </button>
              </div>
              @if (filteredInventory.length === 0) {
                <div class="empty-state">
                  <mat-icon>inventory_2</mat-icon>
                  <p>Nu aveți produse în inventar</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="filteredInventory" class="full-width-table">
                    <ng-container matColumnDef="code">
                      <th mat-header-cell *matHeaderCellDef>Cod</th>
                      <td mat-cell *matCellDef="let i">{{ i.code }}</td>
                    </ng-container>
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Denumire</th>
                      <td mat-cell *matCellDef="let i">{{ i.name }}</td>
                    </ng-container>
                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Categorie</th>
                      <td mat-cell *matCellDef="let i">{{ i.category || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="quantity">
                      <th mat-header-cell *matHeaderCellDef>Cantitate</th>
                      <td mat-cell *matCellDef="let i">{{ i.quantity }} {{ i.unitOfMeasure }}</td>
                    </ng-container>
                    <ng-container matColumnDef="unitPrice">
                      <th mat-header-cell *matHeaderCellDef>Preț Unitar</th>
                      <td mat-cell *matCellDef="let i">{{ i.unitPrice | number:'1.2-2' }} lei</td>
                    </ng-container>
                    <ng-container matColumnDef="totalValue">
                      <th mat-header-cell *matHeaderCellDef>Valoare Totală</th>
                      <td mat-cell *matCellDef="let i">{{ i.totalValue | number:'1.2-2' }} lei</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let i">
                        <mat-chip [color]="getInventoryStatusColor(i.status)" selected>{{ i.status }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let i">
                        <button mat-icon-button color="accent" (click)="openInventoryDialog(i)">
                          <mat-icon>edit</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="inventoryColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: inventoryColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-card>
    </div>

    <!-- Employee Dialog -->
    @if (showEmployeeDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingEmployee ? 'Editează' : 'Angajat Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>CNP</mat-label>
                <input matInput [(ngModel)]="employeeForm.cnp" maxlength="13">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="employeeForm.email" type="email">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Prenume</mat-label>
                <input matInput [(ngModel)]="employeeForm.firstName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Nume</mat-label>
                <input matInput [(ngModel)]="employeeForm.lastName">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Post</mat-label>
                <input matInput [(ngModel)]="employeeForm.position">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Departament</mat-label>
                <mat-select [(ngModel)]="employeeForm.department">
                  <mat-option value="IT">IT</mat-option>
                  <mat-option value="Finance">Finance</mat-option>
                  <mat-option value="HR">HR</mat-option>
                  <mat-option value="Operations">Operations</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tip Contract</mat-label>
                <mat-select [(ngModel)]="employeeForm.employmentType">
                  <mat-option value="FULL_TIME">Full Time</mat-option>
                  <mat-option value="PART_TIME">Part Time</mat-option>
                  <mat-option value="CONTRACT">Contract</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Salariu de bază</mat-label>
                <input matInput [(ngModel)]="employeeForm.baseSalary" type="number">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data angajării</mat-label>
                <input matInput type="date" [(ngModel)]="employeeForm.hireDate">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="employeeForm.status">
                  <mat-option value="ACTIVE">Activ</mat-option>
                  <mat-option value="INACTIVE">Inactiv</mat-option>
                  <mat-option value="SUSPENDED">Suspendat</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveEmployee()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Budget Dialog -->
    @if (showBudgetDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingBudget ? 'Editează' : 'Buget Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Anul</mat-label>
              <input matInput type="number" [(ngModel)]="budgetForm.year">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cod clasificație</mat-label>
                <input matInput [(ngModel)]="budgetForm.classificationCode">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Capitol</mat-label>
                <input matInput [(ngModel)]="budgetForm.chapter">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Articol</mat-label>
                <input matInput [(ngModel)]="budgetForm.article">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Paragraf</mat-label>
                <input matInput [(ngModel)]="budgetForm.paragraph">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Credite autorizate</mat-label>
              <input matInput type="number" [(ngModel)]="budgetForm.authorizedCredit">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="budgetForm.status">
                <mat-option value="DRAFT">Schiță</mat-option>
                <mat-option value="APPROVED">Aprobat</mat-option>
                <mat-option value="REVISED">Revizuit</mat-option>
                <mat-option value="CLOSED">Închis</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveBudget()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Accounting Dialog -->
    @if (showAccountingDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>Înregistrare Contabilă</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data înregistrării</mat-label>
              <input matInput type="date" [(ngModel)]="accountingForm.entryDate">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nr. Document</mat-label>
                <input matInput [(ngModel)]="accountingForm.documentNumber">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Tip Document</mat-label>
                <mat-select [(ngModel)]="accountingForm.documentType">
                  <mat-option value="INVOICE">Factură</mat-option>
                  <mat-option value="RECEIPT">Chitanță</mat-option>
                  <mat-option value="CONTRACT">Contract</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="accountingForm.description" rows="2"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Total Debit</mat-label>
                <input matInput type="number" [(ngModel)]="accountingForm.totalDebit">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Total Credit</mat-label>
                <input matInput type="number" [(ngModel)]="accountingForm.totalCredit">
              </mat-form-field>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveAccounting()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Inventory Dialog -->
    @if (showInventoryDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingInventory ? 'Editează' : 'Produs Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cod produs</mat-label>
                <input matInput [(ngModel)]="inventoryForm.code">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Denumire</mat-label>
                <input matInput [(ngModel)]="inventoryForm.name">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Categorie</mat-label>
              <mat-select [(ngModel)]="inventoryForm.category">
                <mat-option value="Electronics">Electronice</mat-option>
                <mat-option value="Furniture">Mobilier</mat-option>
                <mat-option value="Supplies">Consumabile</mat-option>
              </mat-select>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cantitate</mat-label>
                <input matInput type="number" [(ngModel)]="inventoryForm.quantity">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Unitate de măsură</mat-label>
                <input matInput [(ngModel)]="inventoryForm.unitOfMeasure">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Preț unitar</mat-label>
                <input matInput type="number" [(ngModel)]="inventoryForm.unitPrice">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Stoc minim</mat-label>
                <input matInput type="number" [(ngModel)]="inventoryForm.minStock">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Metodă inventar</mat-label>
              <mat-select [(ngModel)]="inventoryForm.inventoryMethod">
                <mat-option value="FIFO">FIFO</mat-option>
                <mat-option value="LIFO">LIFO</mat-option>
                <mat-option value="PMP">PMP</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveInventory()">Salvează</button>
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
    .stat-value { font-size: 24px; font-weight: 600; }
    .stat-label { font-size: 14px; color: var(--text-secondary); }
    .data-card { margin-bottom: 24px; }
    .tab-content { padding: 24px; min-height: 400px; }
    .tab-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .filter-field { width: 180px; }
    .table-container { overflow-x: auto; }
    .full-width-table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 480px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }
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
export class ErpListComponent implements OnInit {
  private erpService = inject(ErpService);
  private snackBar = inject(MatSnackBar);

  // Data
  employees: ErpEmployee[] = [];
  filteredEmployees: ErpEmployee[] = [];
  budgets: ErpBudget[] = [];
  accountingEntries: ErpAccountingEntry[] = [];
  inventoryItems: ErpInventoryItem[] = [];
  filteredInventory: ErpInventoryItem[] = [];

  selectedTab = 0;

  stats = {
    employees: 0,
    payroll: 0,
    budgetUtilization: 0,
    inventoryValue: 0
  };

  // Filters
  filterDepartment = '';
  filterYear = 2024;
  filterCategory = '';

  // Table columns
  employeeColumns = ['name', 'cnp', 'position', 'department', 'status', 'actions'];
  budgetColumns = ['classificationCode', 'chapter', 'article', 'authorizedCredit', 'revisedCredit', 'status', 'actions'];
  accountingColumns = ['entryDate', 'documentNumber', 'description', 'totalDebit', 'totalCredit', 'isPosted', 'actions'];
  inventoryColumns = ['code', 'name', 'category', 'quantity', 'unitPrice', 'totalValue', 'status', 'actions'];

  // Dialog states
  showEmployeeDialog = false;
  showBudgetDialog = false;
  showAccountingDialog = false;
  showInventoryDialog = false;

  editingEmployee: ErpEmployee | null = null;
  editingBudget: ErpBudget | null = null;
  editingInventory: ErpInventoryItem | null = null;

  // Forms
  employeeForm: Partial<ErpEmployee> = this.getEmptyEmployee();
  budgetForm: Partial<ErpBudget> = this.getEmptyBudget();
  accountingForm: Partial<ErpAccountingEntry> = this.getEmptyAccounting();
  inventoryForm: Partial<ErpInventoryItem> = this.getEmptyInventory();

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.erpService.getEmployees().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as ErpEmployee[]); })
    ).subscribe((data) => {
      this.employees = data;
      this.filteredEmployees = data;
      this.stats.employees = data.length;
    });

    this.erpService.getBudgets().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as ErpBudget[]); })
    ).subscribe((data) => {
      this.budgets = data;
      this.stats.budgetUtilization = 0;
    });

    this.erpService.getAccountingEntries().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as ErpAccountingEntry[]); })
    ).subscribe((data) => {
      this.accountingEntries = data;
    });

    this.erpService.getInventoryItems().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as ErpInventoryItem[]); })
    ).subscribe((data) => {
      this.inventoryItems = data;
      this.filteredInventory = data;
      this.calcInventoryValue();
    });

    this.stats.payroll = 0;
  }

  calcInventoryValue() {
    this.stats.inventoryValue = this.inventoryItems.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  }

  filterEmployees() {
    if (this.filterDepartment) {
      this.filteredEmployees = this.employees.filter(e => e.department === this.filterDepartment);
    } else {
      this.filteredEmployees = [...this.employees];
    }
  }

  filterBudgets() {
    this.budgets = this.budgets.filter(b => b.year === this.filterYear);
  }

  filterInventory() {
    if (this.filterCategory) {
      this.filteredInventory = this.inventoryItems.filter(i => i.category === this.filterCategory);
    } else {
      this.filteredInventory = [...this.inventoryItems];
    }
  }

  // Employee
  openEmployeeDialog(employee?: ErpEmployee) {
    this.editingEmployee = employee || null;
    this.employeeForm = employee ? { ...employee } : this.getEmptyEmployee();
    this.showEmployeeDialog = true;
  }

  saveEmployee() {
    if (this.editingEmployee) {
      const index = this.employees.findIndex(e => e.id === this.editingEmployee!.id);
      if (index >= 0) this.employees[index] = { ...this.employees[index], ...this.employeeForm };
      this.showSnackBar('Angajat actualizat');
    } else {
      const newEmployee = { ...this.employeeForm, id: crypto.randomUUID() } as ErpEmployee;
      this.employees.push(newEmployee);
      this.stats.employees++;
      this.showSnackBar('Angajat creat');
    }
    this.filterEmployees();
    this.closeDialogs();
  }

  // Budget
  openBudgetDialog(budget?: ErpBudget) {
    this.editingBudget = budget || null;
    this.budgetForm = budget ? { ...budget } : this.getEmptyBudget();
    this.showBudgetDialog = true;
  }

  saveBudget() {
    if (this.editingBudget) {
      const index = this.budgets.findIndex(b => b.id === this.editingBudget!.id);
      if (index >= 0) this.budgets[index] = { ...this.budgets[index], ...this.budgetForm };
      this.showSnackBar('Buget actualizat');
    } else {
      const newBudget = { ...this.budgetForm, id: crypto.randomUUID() } as ErpBudget;
      this.budgets.push(newBudget);
      this.showSnackBar('Buget creat');
    }
    this.closeDialogs();
  }

  // Accounting
  openAccountingDialog() {
    this.accountingForm = this.getEmptyAccounting();
    this.showAccountingDialog = true;
  }

  saveAccounting() {
    const newEntry = { ...this.accountingForm, id: crypto.randomUUID(), isPosted: false } as ErpAccountingEntry;
    this.accountingEntries.push(newEntry);
    this.showSnackBar('Înregistrare adăugată');
    this.closeDialogs();
  }

  postEntry(entry: ErpAccountingEntry) {
    entry.isPosted = true;
    entry.postedAt = new Date().toISOString();
    this.showSnackBar('Înregistrare postată');
  }

  // Inventory
  openInventoryDialog(item?: ErpInventoryItem) {
    this.editingInventory = item || null;
    this.inventoryForm = item ? { ...item } : this.getEmptyInventory();
    this.showInventoryDialog = true;
  }

  saveInventory() {
    if (this.editingInventory) {
      const index = this.inventoryItems.findIndex(i => i.id === this.editingInventory!.id);
      if (index >= 0) this.inventoryItems[index] = { ...this.inventoryItems[index], ...this.inventoryForm, totalValue: (this.inventoryForm.quantity || 0) * (this.inventoryForm.unitPrice || 0) };
      this.showSnackBar('Produs actualizat');
    } else {
      const newItem = { ...this.inventoryForm, id: crypto.randomUUID(), totalValue: (this.inventoryForm.quantity || 0) * (this.inventoryForm.unitPrice || 0), status: 'ACTIVE' as ItemStatus } as ErpInventoryItem;
      this.inventoryItems.push(newItem);
      this.showSnackBar('Produs creat');
    }
    this.calcInventoryValue();
    this.filterInventory();
    this.closeDialogs();
  }

  closeDialogs() {
    this.showEmployeeDialog = false;
    this.showBudgetDialog = false;
    this.showAccountingDialog = false;
    this.showInventoryDialog = false;
    this.editingEmployee = null;
    this.editingBudget = null;
    this.editingInventory = null;
  }

  // Labels
  getEmployeeStatusLabel(status: EmployeeStatus): string {
    const labels: Record<EmployeeStatus, string> = { 'ACTIVE': 'Activ', 'INACTIVE': 'Inactiv', 'SUSPENDED': 'Suspendat', 'TERMINATED': 'Terminat' };
    return labels[status] || status;
  }

  getEmployeeStatusColor(status: EmployeeStatus): string {
    if (status === 'ACTIVE') return 'accent';
    if (status === 'SUSPENDED' || status === 'TERMINATED') return 'warn';
    return '';
  }

  getBudgetStatusLabel(status: BudgetStatus): string {
    const labels: Record<BudgetStatus, string> = { 'DRAFT': 'Schiță', 'APPROVED': 'Aprobat', 'REVISED': 'Revizuit', 'CLOSED': 'Închis' };
    return labels[status] || status;
  }

  getBudgetStatusColor(status: BudgetStatus): string {
    if (status === 'APPROVED' || status === 'REVISED') return 'accent';
    if (status === 'CLOSED') return 'warn';
    return '';
  }

  getInventoryStatusColor(status: ItemStatus): string {
    if (status === 'ACTIVE') return 'accent';
    if (status === 'DISCONTINUED') return 'warn';
    return '';
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }

  private getEmptyEmployee() {
    return { cnp: '', firstName: '', lastName: '', employmentType: 'FULL_TIME' as EmploymentType, status: 'ACTIVE' as EmployeeStatus, isActive: true };
  }

  private getEmptyBudget() {
    return { year: 2024, status: 'DRAFT' as BudgetStatus, isActive: true };
  }

  private getEmptyAccounting() {
    return { entryDate: new Date().toISOString().split('T')[0], isPosted: false, isReversed: false, isActive: true };
  }

  private getEmptyInventory() {
    return { code: '', name: '', quantity: 0, unitPrice: 0, inventoryMethod: 'FIFO' as InventoryMethod, status: 'ACTIVE' as ItemStatus, isActive: true };
  }

}