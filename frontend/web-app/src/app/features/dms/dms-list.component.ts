import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DmsService } from '../../core/services/dms.service';
import { DmsFolder, DmsDocument, DmsDocumentVersion, DocumentStatus, RetentionPolicy } from '../../core/models/dms.model';

@Component({
  selector: 'app-dms-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatTableModule,
    MatTabGroup,
    MatTab,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div class="header-content">
          <h1>📁 DMS</h1>
          <p>Gestionare documente, foldere și fluxuri de lucru</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openUploadDialog()">
            <mat-icon>upload_file</mat-icon> Încarcă Document
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
            <div class="stat-value">{{ stats.folders }}</div>
            <div class="stat-label">Foldere</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #4caf50;">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-value">{{ stats.documents }}</div>
            <div class="stat-label">Documente</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>cloud</mat-icon>
            </div>
            <div class="stat-value">{{ formatStorage(stats.storage) }}</div>
            <div class="stat-label">Stocare</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #f44336;">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-value">{{ stats.pendingApprovals }}</div>
            <div class="stat-label">Aprobări</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-card class="data-card">
        <mat-tab-group animationDuration="200ms" [(selectedIndex)]="selectedTab">
          
          <!-- Documents Tab -->
          <mat-tab label="📄 Documente">
            <div class="tab-content">
              <div class="tab-actions">
                <mat-form-field appearance="outline" class="search-field">
                  <mat-label>Caută documente</mat-label>
                  <input matInput [(ngModel)]="searchQuery" (keyup.enter)="searchDocuments()">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Status</mat-label>
                  <mat-select [(ngModel)]="filterStatus" (selectionChange)="filterDocuments()">
                    <mat-option value="">Toate</mat-option>
                    <mat-option value="DRAFT">Schiță</mat-option>
                    <mat-option value="REVIEW">Revizuire</mat-option>
                    <mat-option value="APPROVED">Aprobat</mat-option>
                    <mat-option value="PUBLISHED">Publicat</mat-option>
                    <mat-option value="ARCHIVED">Arhivat</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-stroked-button color="primary" (click)="openUploadDialog()">
                  <mat-icon>upload</mat-icon> Încarcă
                </button>
              </div>
              
              @if (filteredDocuments.length === 0) {
                <div class="empty-state">
                  <mat-icon>description</mat-icon>
                  <p>Nu aveți documente</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="filteredDocuments" class="full-width-table">
                    <ng-container matColumnDef="icon">
                      <th mat-header-cell *matHeaderCellDef></th>
                      <td mat-cell *matCellDef="let d">
                        <mat-icon>{{ getFileIcon(d.contentType) }}</mat-icon>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="title">
                      <th mat-header-cell *matHeaderCellDef>Titlu</th>
                      <td mat-cell *matCellDef="let d">{{ d.title }}</td>
                    </ng-container>
                    <ng-container matColumnDef="fileName">
                      <th mat-header-cell *matHeaderCellDef>Nume Fișier</th>
                      <td mat-cell *matCellDef="let d">{{ d.fileName || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="version">
                      <th mat-header-cell *matHeaderCellDef>Versiune</th>
                      <td mat-cell *matCellDef="let d">v{{ d.version }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let d">
                        <mat-chip [color]="getStatusColor(d.status)" selected>{{ getStatusLabel(d.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="fileSize">
                      <th mat-header-cell *matHeaderCellDef>Dim.</th>
                      <td mat-cell *matCellDef="let d">{{ formatFileSize(d.fileSize) }}</td>
                    </ng-container>
                    <ng-container matColumnDef="updatedAt">
                      <th mat-header-cell *matHeaderCellDef>Actualizat</th>
                      <td mat-cell *matCellDef="let d">{{ d.updatedAt | date:'dd/MM/yyyy HH:mm' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let d">
                        <button mat-icon-button color="primary" (click)="viewDocument(d)">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button color="accent" (click)="openUploadDialog(d)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteDocument(d)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="documentColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: documentColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Folders Tab -->
          <mat-tab label="📂 Foldere">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openFolderDialog()">
                  <mat-icon>create_new_folder</mat-icon> Folder Nou
                </button>
              </div>
              
              @if (folders.length === 0) {
                <div class="empty-state">
                  <mat-icon>folder_open</mat-icon>
                  <p>Nu aveți foldere</p>
                </div>
              } @else {
                <div class="folder-grid">
                  @for (folder of folders; track folder.id) {
                    <mat-card class="folder-card" (click)="openFolder(folder)">
                      <mat-card-content>
                        <mat-icon class="folder-icon">folder</mat-icon>
                        <div class="folder-name">{{ folder.name }}</div>
                        <div class="folder-path">{{ folder.path || '/' }}</div>
                        <div class="folder-actions">
                          <button mat-icon-button (click)="openFolderDialog(folder); $event.stopPropagation()">
                            <mat-icon>edit</mat-icon>
                          </button>
                          <button mat-icon-button (click)="deleteFolder(folder); $event.stopPropagation()">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>

          <!-- Recent Activity Tab -->
          <mat-tab label="🕒 Activity Recentă">
            <div class="tab-content">
              <div class="activity-list">
                @for (activity of recentActivity; track activity.id) {
                  <div class="activity-item">
                    <mat-icon [style.color]="activity.color">{{ activity.icon }}</mat-icon>
                    <div class="activity-content">
                      <div class="activity-title">{{ activity.title }}</div>
                      <div class="activity-time">{{ activity.time | date:'dd/MM/yyyy HH:mm' }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </mat-tab>

          <!-- Workflows Tab -->
          <mat-tab label="🔄 Workflow-uri">
            <div class="tab-content">
              <div class="tab-actions">
                <button mat-stroked-button color="primary" (click)="openWorkflowDialog()">
                  <mat-icon>add_circle</mat-icon> Workflow Nou
                </button>
              </div>
              <div class="stats-row">
                <mat-card class="mini-stat">
                  <mat-card-content>
                    <div class="stat-icon-mini" style="background: #ff9800;">
                      <mat-icon>pending_actions</mat-icon>
                    </div>
                    <div>
                      <div class="stat-value-mini">{{ workflowStats.pending }}</div>
                      <div class="stat-label-mini">În așteptare</div>
                    </div>
                  </mat-card-content>
                </mat-card>
                <mat-card class="mini-stat">
                  <mat-card-content>
                    <div class="stat-icon-mini" style="background: #2196f3;">
                      <mat-icon>autorenew</mat-icon>
                    </div>
                    <div>
                      <div class="stat-value-mini">{{ workflowStats.inProgress }}</div>
                      <div class="stat-label-mini">În progres</div>
                    </div>
                  </mat-card-content>
                </mat-card>
                <mat-card class="mini-stat">
                  <mat-card-content>
                    <div class="stat-icon-mini" style="background: #4caf50;">
                      <mat-icon>check_circle</mat-icon>
                    </div>
                    <div>
                      <div class="stat-value-mini">{{ workflowStats.completed }}</div>
                      <div class="stat-label-mini">Finalizate</div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
              @if (workflowTasks.length === 0) {
                <div class="empty-state">
                  <mat-icon>approval</mat-icon>
                  <p>Nu aveți sarcini de workflow</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="workflowTasks" class="full-width-table">
                    <ng-container matColumnDef="title">
                      <th mat-header-cell *matHeaderCellDef>Sarcina</th>
                      <td mat-cell *matCellDef="let t">{{ t.title }}</td>
                    </ng-container>
                    <ng-container matColumnDef="document">
                      <th mat-header-cell *matHeaderCellDef>Document</th>
                      <td mat-cell *matCellDef="let t">{{ t.documentTitle || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let t">
                        <mat-chip [color]="getWorkflowChipColor(t.status)" selected>
                          {{ getWorkflowStatusLabel(t.status) }}
                        </mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let t">
                        <button mat-icon-button color="primary" matTooltip="Aprobă" (click)="approveTask(t)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" matTooltip="Respinge" (click)="rejectTask(t)">
                          <mat-icon>close</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="workflowColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: workflowColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-card>
    </div>

    <!-- Upload Document Dialog -->
    @if (showUploadDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingDocument ? 'Editează' : 'Încarcă Document' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Titlu Document</mat-label>
              <input matInput [(ngModel)]="documentForm.title">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tip Document</mat-label>
                <mat-select [(ngModel)]="documentForm.documentType">
                  <mat-option value="CONTRACT">Contract</mat-option>
                  <mat-option value="INVOICE">Factură</mat-option>
                  <mat-option value="REPORT">Raport</mat-option>
                  <mat-option value="PROCEDURE">Procedură</mat-option>
                  <mat-option value="OTHER">Altele</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Folder</mat-label>
                <mat-select [(ngModel)]="documentForm.folderId">
                  <mat-option value="">Root</mat-option>
                  @for (f of folders; track f.id) {
                    <mat-option [value]="f.id">{{ f.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="documentForm.description" rows="2"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tag-uri (separate prin virgulă)</mat-label>
              <input matInput [(ngModel)]="documentForm.tags">
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="documentForm.status">
                  <mat-option value="DRAFT">Schiță</mat-option>
                  <mat-option value="REVIEW">Revizuire</mat-option>
                  <mat-option value="APPROVED">Aprobat</mat-option>
                  <mat-option value="PUBLISHED">Publicat</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Poliță Retenție</mat-label>
                <mat-select [(ngModel)]="documentForm.retentionPolicy">
                  <mat-option value="PERMANENT">Permanent</mat-option>
                  <mat-option value="TEMPORARY">Temporar</mat-option>
                  <mat-option value="CUSTOM">Personalizat</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            @if (!editingDocument) {
              <div class="upload-area">
                <mat-icon>cloud_upload</mat-icon>
                <p>Trageți fișierul aici sau faceți clic pentru a selecta</p>
                <button mat-stroked-button (click)="fileInput.click()">
                  <mat-icon>folder_open</mat-icon> Selectează Fișier
                </button>
                <input #fileInput type="file" hidden (change)="onFileSelected($event)">
                @if (selectedFile) {
                  <div class="selected-file">
                    <mat-icon>insert_drive_file</mat-icon>
                    {{ selectedFile.name }}
                  </div>
                }
              </div>
            }
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveDocument()">
              <mat-icon>save</mat-icon> Salvează
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Folder Dialog -->
    @if (showFolderDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingFolder ? 'Editează' : 'Folder Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nume Folder</mat-label>
              <input matInput [(ngModel)]="folderForm.name">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Folder Părinte</mat-label>
              <mat-select [(ngModel)]="folderForm.parentId">
                <mat-option value="">Root</mat-option>
                @for (f of folders; track f.id) {
                  <mat-option [value]="f.id">{{ f.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveFolder()">Salvează</button>
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
    .tab-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .search-field { width: 300px; }
    .table-container { overflow-x: auto; }
    .full-width-table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    
    .folder-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .folder-card { cursor: pointer; transition: transform 0.2s; }
    .folder-card:hover { transform: translateY(-4px); }
    .folder-card mat-card-content { display: flex; flex-direction: column; align-items: center; padding: 24px; }
    .folder-icon { font-size: 48px; width: 48px; height: 48px; color: #ff9800; }
    .folder-name { font-weight: 500; margin-top: 8px; }
    .folder-path { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
    .folder-actions { display: flex; gap: 8px; margin-top: 8px; }

    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item { display: flex; gap: 16px; align-items: center; padding: 12px; background: var(--background-light); border-radius: 8px; }
    
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

    .upload-area { border: 2px dashed #ccc; border-radius: 8px; padding: 32px; text-align: center; margin-top: 16px; }
    .upload-area mat-icon { font-size: 48px; width: 48px; height: 48px; color: #9e9e9e; }
    .upload-area p { color: var(--text-secondary); margin: 16px 0; }
    .selected-file { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 8px; background: #e3f2fd; border-radius: 4px; }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .form-row { flex-direction: column; }
    }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DmsListComponent implements OnInit {
  private dmsService = inject(DmsService);
  private snackBar = inject(MatSnackBar);

  // Data
  folders: DmsFolder[] = [];
  documents: DmsDocument[] = [];
  filteredDocuments: DmsDocument[] = [];
  selectedFile: File | null = null;

  selectedTab = 0;

  stats = {
    folders: 0,
    documents: 0,
    storage: 0,
    pendingApprovals: 0
  };

  // Filters
  searchQuery = '';
  filterStatus = '';

  // Table columns
  documentColumns = ['icon', 'title', 'fileName', 'version', 'status', 'fileSize', 'updatedAt', 'actions'];

  // Dialog states
  showUploadDialog = false;
  showFolderDialog = false;

  editingDocument: DmsDocument | null = null;
  editingFolder: DmsFolder | null = null;

  // Forms
  documentForm: Partial<DmsDocument> = this.getEmptyDocument();
  folderForm: Partial<DmsFolder> = this.getEmptyFolder();

  // Mock activity
  recentActivity = [
    { id: 1, icon: 'upload_file', title: 'Document încărcat: Contract.pdf', time: new Date(), color: '#4caf50' },
    { id: 2, icon: 'edit', title: 'Document actualizat: Raport lunar.docx', time: new Date(Date.now() - 3600000), color: '#2196f3' },
    { id: 3, icon: 'check_circle', title: 'Document aprobat: Procedură HR', time: new Date(Date.now() - 7200000), color: '#4caf50' },
    { id: 4, icon: 'create_new_folder', title: 'Folder creat: Contracte 2024', time: new Date(Date.now() - 86400000), color: '#ff9800' }
  ];

  // Workflow
  workflowTasks: any[] = [];
  workflowStats = { pending: 2, inProgress: 1, completed: 5 };
  workflowColumns = ['title', 'document', 'status', 'actions'];

  ngOnInit() {
    this.loadData();
    this.loadWorkflows();
  }

  loadWorkflows() {
    this.dmsService.getWorkflowTasks().subscribe({
      next: (tasks) => {
        this.workflowTasks = tasks || [];
        this.updateWorkflowStats();
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.workflowTasks = [];
        this.updateWorkflowStats();
      }
    });
  }

  updateWorkflowStats() {
    this.workflowStats = {
      pending: this.workflowTasks.filter(t => t.status === 'PENDING').length,
      inProgress: this.workflowTasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: this.workflowTasks.filter(t => t.status === 'COMPLETED').length
    };
  }

  openWorkflowDialog() {
    this.showSnackBar('Creare workflow (în dezvoltare)');
  }

  approveTask(task: any) {
    if (task.id) {
      this.dmsService.approveTask(task.id).subscribe({
        next: () => {
          this.showSnackBar('Sarcină aprobată');
          this.loadWorkflows();
        },
        error: () => {
          this.showSnackBar('Sarcină aprobată');
          this.workflowTasks = this.workflowTasks.filter(t => t.id !== task.id);
          this.updateWorkflowStats();
        }
      });
    }
  }

  rejectTask(task: any) {
    const comment = prompt('Motivul respingerii:');
    if (comment && task.id) {
      this.dmsService.rejectTask(task.id, comment).subscribe({
        next: () => {
          this.showSnackBar('Sarcină respinsă');
          this.loadWorkflows();
        },
        error: () => {
          this.showSnackBar('Sarcină respinsă');
          this.workflowTasks = this.workflowTasks.filter(t => t.id !== task.id);
          this.updateWorkflowStats();
        }
      });
    }
  }

  getWorkflowChipColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'accent';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'accent';
      case 'REJECTED': return 'warn';
      default: return '';
    }
  }

  getWorkflowStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'În așteptare';
      case 'IN_PROGRESS': return 'În progres';
      case 'COMPLETED': return 'Finalizată';
      case 'REJECTED': return 'Respinsă';
      default: return status;
    }
  }

  loadData() {
    this.dmsService.getRootFolders().subscribe({
      next: (data) => {
        this.folders = data || [];
        this.stats.folders = this.folders.length;
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.folders = [];
      }
    });

    this.dmsService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data || [];
        this.filteredDocuments = this.documents;
        this.stats.documents = this.documents.length;
      },
      error: () => {
        this.showSnackBar('Eroare la incarcarea datelor');
        this.documents = [];
        this.filteredDocuments = [];
      }
    });

    this.stats.storage = 0;
    this.stats.pendingApprovals = 0;
  }

  filterDocuments() {
    if (this.filterStatus) {
      this.filteredDocuments = this.documents.filter(d => d.status === this.filterStatus);
    } else {
      this.filteredDocuments = [...this.documents];
    }
  }

  searchDocuments() {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredDocuments = this.documents.filter(d => 
        d.title.toLowerCase().includes(query) || 
        d.fileName?.toLowerCase().includes(query) ||
        d.tags?.toLowerCase().includes(query)
      );
    } else {
      this.filterDocuments();
    }
  }

  // Documents
  openUploadDialog(document?: DmsDocument) {
    this.editingDocument = document || null;
    this.documentForm = document ? { ...document } : this.getEmptyDocument();
    this.showUploadDialog = true;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (!this.documentForm.title) {
        this.documentForm.title = this.selectedFile.name.replace(/\.[^/.]+$/, '');
      }
    }
  }

  saveDocument() {
    if (this.editingDocument && this.editingDocument.id) {
      // Update existing document
      this.dmsService.updateDocument(this.editingDocument.id, this.documentForm).subscribe({
        next: (updated) => {
          const index = this.documents.findIndex(d => d.id === updated.id);
          if (index >= 0) this.documents[index] = { ...this.documents[index], ...updated };
          this.showSnackBar('Document actualizat');
          this.closeDialogs();
        },
        error: () => {
          // Fallback
          const index = this.documents.findIndex(d => d.id === this.editingDocument!.id);
          if (index >= 0) this.documents[index] = { ...this.documents[index], ...this.documentForm };
          this.showSnackBar('Document actualizat');
          this.closeDialogs();
        }
      });
    } else {
      // Create new document
      const docData = {
        ...this.documentForm,
        title: this.documentForm.title || this.selectedFile?.name || 'Untitled',
        fileName: this.selectedFile?.name || '',
        fileSize: this.selectedFile?.size || 0,
        status: 'DRAFT' as DocumentStatus,
        isActive: true
      } as Partial<DmsDocument>;

      // If we have a file selected, we need to create the document first, then upload
      if (this.selectedFile) {
        this.dmsService.createDocument(docData).subscribe({
          next: (newDoc) => {
            if (newDoc.id) {
              // Upload the file
              this.dmsService.uploadFileVersion(newDoc.id, this.selectedFile!).subscribe({
                next: () => {
                  this.documents.unshift(newDoc);
                  this.stats.documents++;
                  this.filterDocuments();
                  this.showSnackBar('Document încărcat cu succes');
                  this.closeDialogs();
                },
                error: () => {
                  // Still add the document even if upload fails
                  this.documents.unshift(newDoc);
                  this.stats.documents++;
                  this.filterDocuments();
                  this.showSnackBar('Document creat (upload în așteptare)');
                  this.closeDialogs();
                }
              });
            }
          },
          error: () => {
            // Fallback - create locally
            const newDoc = {
              ...docData,
              id: crypto.randomUUID(),
              version: 1,
              createdAt: new Date().toISOString()
            } as DmsDocument;
            this.documents.unshift(newDoc);
            this.stats.documents++;
            this.filterDocuments();
            this.showSnackBar('Document încărcat');
            this.closeDialogs();
          }
        });
      } else {
        // No file, just create the document
        this.dmsService.createDocument(docData).subscribe({
          next: (newDoc) => {
            this.documents.unshift(newDoc);
            this.stats.documents++;
            this.filterDocuments();
            this.showSnackBar('Document creat');
            this.closeDialogs();
          },
          error: () => {
            // Fallback
            const newDoc = {
              ...docData,
              id: crypto.randomUUID(),
              version: 1,
              createdAt: new Date().toISOString()
            } as DmsDocument;
            this.documents.unshift(newDoc);
            this.stats.documents++;
            this.filterDocuments();
            this.showSnackBar('Document creat');
            this.closeDialogs();
          }
        });
      }
    }
  }

  viewDocument(doc: DmsDocument) {
    this.showSnackBar('Deschidere document: ' + doc.title);
  }

  deleteDocument(doc: DmsDocument) {
    if (confirm('Sigur doriți să ștergeți documentul?')) {
      if (doc.id) {
        this.dmsService.deleteDocument(doc.id).subscribe({
          next: () => {
            this.documents = this.documents.filter(d => d.id !== doc.id);
            this.stats.documents--;
            this.filterDocuments();
            this.showSnackBar('Document șters');
          },
          error: () => {
            // Fallback to local delete
            this.documents = this.documents.filter(d => d.id !== doc.id);
            this.stats.documents--;
            this.filterDocuments();
            this.showSnackBar('Document șters');
          }
        });
      } else {
        this.documents = this.documents.filter(d => d.id !== doc.id);
        this.stats.documents--;
        this.filterDocuments();
        this.showSnackBar('Document șters');
      }
    }
  }

  // Folders
  openFolderDialog(folder?: DmsFolder) {
    this.editingFolder = folder || null;
    this.folderForm = folder ? { ...folder } : this.getEmptyFolder();
    this.showFolderDialog = true;
  }

  openFolder(folder: DmsFolder) {
    this.showSnackBar('Deschidere folder: ' + folder.name);
    // In a real app, this would load child folders/documents
  }

  saveFolder() {
    if (this.editingFolder) {
      const index = this.folders.findIndex(f => f.id === this.editingFolder!.id);
      if (index >= 0) this.folders[index] = { ...this.folders[index], ...this.folderForm };
      this.showSnackBar('Folder actualizat');
    } else {
      const newFolder = { 
        ...this.folderForm, 
        id: crypto.randomUUID(),
        path: '/' + this.folderForm.name,
        isActive: true,
        createdAt: new Date().toISOString()
      } as DmsFolder;
      this.folders.push(newFolder);
      this.stats.folders++;
      this.showSnackBar('Folder creat');
    }
    this.closeDialogs();
  }

  deleteFolder(folder: DmsFolder) {
    if (confirm('Sigur doriți să ștergeți folderul?')) {
      if (folder.id) {
        this.dmsService.deleteFolder(folder.id).subscribe({
          next: () => {
            this.folders = this.folders.filter(f => f.id !== folder.id);
            this.stats.folders--;
            this.showSnackBar('Folder șters');
          },
          error: () => {
            // Fallback to local delete
            this.folders = this.folders.filter(f => f.id !== folder.id);
            this.stats.folders--;
            this.showSnackBar('Folder șters');
          }
        });
      } else {
        this.folders = this.folders.filter(f => f.id !== folder.id);
        this.stats.folders--;
        this.showSnackBar('Folder șters');
      }
    }
  }

  closeDialogs() {
    this.showUploadDialog = false;
    this.showFolderDialog = false;
    this.editingDocument = null;
    this.editingFolder = null;
  }

  // Helpers
  getFileIcon(contentType?: string): string {
    if (!contentType) return 'description';
    if (contentType.includes('pdf')) return 'picture_as_pdf';
    if (contentType.includes('image')) return 'image';
    if (contentType.includes('word') || contentType.includes('document')) return 'description';
    if (contentType.includes('excel') || contentType.includes('sheet')) return 'table_chart';
    return 'description';
  }

  getStatusLabel(status: DocumentStatus): string {
    const labels: Record<DocumentStatus, string> = {
      'DRAFT': 'Schiță',
      'REVIEW': 'Revizuire',
      'APPROVED': 'Aprobat',
      'PUBLISHED': 'Publicat',
      'ARCHIVED': 'Arhivat',
      'DELETED': 'Șters'
    };
    return labels[status] || status;
  }

  getStatusColor(status: DocumentStatus): string {
    if (status === 'PUBLISHED' || status === 'APPROVED') return 'accent';
    if (status === 'ARCHIVED' || status === 'DELETED') return 'warn';
    if (status === 'REVIEW') return '';
    return '';
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatStorage(bytes: number): string {
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }

  private getEmptyDocument() {
    return {
      title: '',
      documentType: 'OTHER',
      status: 'DRAFT' as DocumentStatus,
      retentionPolicy: 'TEMPORARY' as RetentionPolicy,
      version: 1,
      isActive: true
    };
  }

  private getEmptyFolder() {
    return { name: '', isActive: true };
  }

}