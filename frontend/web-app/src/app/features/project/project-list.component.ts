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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { catchError, of } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { Project, ProjectTask, Milestone, ProjectStatus, ProjectPriority, TaskStatus, TaskPriority } from '../../core/models/project.model';

@Component({
  selector: 'app-project-list',
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
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div class="header-content">
          <h1>📋 Proiecte</h1>
          <p>Management proiecte, taskuri și milestone-uri</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openProjectDialog()">
            <mat-icon>add</mat-icon> Proiect Nou
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #2196f3;">
              <mat-icon>folder_open</mat-icon>
            </div>
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total Proiecte</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #4caf50;">
              <mat-icon>play_circle</mat-icon>
            </div>
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">În Desfășurare</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #ff9800;">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-value">{{ stats.pendingTasks }}</div>
            <div class="stat-label">Taskuri Penente</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" style="background: #9c27b0;">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">Finalizate</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Projects List -->
      <mat-card class="data-card">
        <mat-tab-group animationDuration="200ms" [(selectedIndex)]="selectedTab">
          
          <!-- Projects Tab -->
          <mat-tab label="📁 Proiecte">
            <div class="tab-content">
              @if (projects.length === 0) {
                <div class="empty-state">
                  <mat-icon>folder_open</mat-icon>
                  <p>Nu aveți proiecte</p>
                  <button mat-raised-button color="primary" (click)="openProjectDialog()">
                    <mat-icon>add</mat-icon> Creează Proiect
                  </button>
                </div>
              } @else {
                <div class="projects-grid">
                  @for (project of projects; track project.id) {
                    <mat-card class="project-card" [class.selected]="selectedProject?.id === project.id" (click)="selectProject(project)">
                      <mat-card-header>
                        <mat-card-title>{{ project.name }}</mat-card-title>
                        <mat-card-subtitle>{{ project.description || 'Fără descriere' }}</mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <div class="project-status">
                          <mat-chip [color]="getProjectStatusColor(project.status)" selected>{{ getProjectStatusLabel(project.status) }}</mat-chip>
                          <mat-chip [color]="getPriorityColor(project.priority)">{{ getPriorityLabel(project.priority) }}</mat-chip>
                        </div>
                        <div class="project-dates">
                          <span><mat-icon>date_range</mat-icon> {{ project.startDate | date:'dd/MM/yyyy' }} - {{ project.endDate | date:'dd/MM/yyyy' }}</span>
                        </div>
                        <div class="project-progress">
                          <div class="progress-label">
                            <span>Progres</span>
                            <span>{{ project.progress }}%</span>
                          </div>
                          <mat-progress-bar mode="determinate" [value]="project.progress"></mat-progress-bar>
                        </div>
                        <div class="project-manager">
                          <mat-icon>person</mat-icon> {{ project.managerName || 'NefAssignat' }}
                        </div>
                      </mat-card-content>
                      <mat-card-actions>
                        <button mat-button color="primary" (click)="openProjectDialog(project); $event.stopPropagation()">
                          <mat-icon>edit</mat-icon> Editează
                        </button>
                        <button mat-button color="warn" (click)="deleteProject(project); $event.stopPropagation()">
                          <mat-icon>delete</mat-icon> Șterge
                        </button>
                      </mat-card-actions>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>

          <!-- Tasks Tab -->
          <mat-tab label="✅ Taskuri" [disabled]="!selectedProject">
            <div class="tab-content">
              <div class="tab-actions">
                @if (selectedProject) {
                  <span class="project-badge">{{ selectedProject.name }}</span>
                  <button mat-stroked-button color="primary" (click)="openTaskDialog()">
                    <mat-icon>add</mat-icon> Task Nou
                  </button>
                }
              </div>
              
              @if (!selectedProject) {
                <div class="empty-state">
                  <mat-icon>touch_app</mat-icon>
                  <p>Selectați un proiect pentru a vedea taskurile</p>
                </div>
              } @else if (tasks.length === 0) {
                <div class="empty-state">
                  <mat-icon>assignment</mat-icon>
                  <p>Nu aveți taskuri în acest proiect</p>
                </div>
              } @else {
                <div class="table-container">
                  <table mat-table [dataSource]="tasks" class="full-width-table">
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let t">
                        <mat-chip [color]="getTaskStatusColor(t.status)" selected>{{ getTaskStatusLabel(t.status) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="title">
                      <th mat-header-cell *matHeaderCellDef>Task</th>
                      <td mat-cell *matCellDef="let t">{{ t.title }}</td>
                    </ng-container>
                    <ng-container matColumnDef="assignee">
                      <th mat-header-cell *matHeaderCellDef>Assignat</th>
                      <td mat-cell *matCellDef="let t">{{ t.assigneeName || '-' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="priority">
                      <th mat-header-cell *matHeaderCellDef>Prioritate</th>
                      <td mat-cell *matCellDef="let t">
                        <mat-chip [color]="getPriorityColor(t.priority)">{{ getPriorityLabel(t.priority) }}</mat-chip>
                      </td>
                    </ng-container>
                    <ng-container matColumnDef="dueDate">
                      <th mat-header-cell *matHeaderCellDef>Termen</th>
                      <td mat-cell *matCellDef="let t">{{ t.endDate | date:'dd/MM/yyyy' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="progress">
                      <th mat-header-cell *matHeaderCellDef>Progres</th>
                      <td mat-cell *matCellDef="let t">{{ t.progress }}%</td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acțiuni</th>
                      <td mat-cell *matCellDef="let t">
                        <button mat-icon-button color="accent" (click)="openTaskDialog(t)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteTask(t)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="taskColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: taskColumns;"></tr>
                  </table>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Milestones Tab -->
          <mat-tab label="🎯 Milestone-uri" [disabled]="!selectedProject">
            <div class="tab-content">
              <div class="tab-actions">
                @if (selectedProject) {
                  <span class="project-badge">{{ selectedProject.name }}</span>
                  <button mat-stroked-button color="primary" (click)="openMilestoneDialog()">
                    <mat-icon>add</mat-icon> Milestone Nou
                  </button>
                }
              </div>
              
              @if (!selectedProject) {
                <div class="empty-state">
                  <mat-icon>flag</mat-icon>
                  <p>Selectați un proiect pentru a vedea milestone-urile</p>
                </div>
              } @else if (milestones.length === 0) {
                <div class="empty-state">
                  <mat-icon>flag</mat-icon>
                  <p>Nu aveți milestone-uri definite</p>
                </div>
              } @else {
                <div class="milestones-list">
                  @for (m of milestones; track m.id) {
                    <mat-card class="milestone-item">
                      <div class="milestone-content">
                        <mat-icon [style.color]="getMilestoneStatusColor(m.status)">flag</mat-icon>
                        <div class="milestone-info">
                          <div class="milestone-name">{{ m.name }}</div>
                          <div class="milestone-date">Termen: {{ m.dueDate | date:'dd/MM/yyyy' }}</div>
                        </div>
                        <mat-chip [color]="getMilestoneStatusColor(m.status)" selected>{{ m.status }}</mat-chip>
                      </div>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-card>
    </div>

    <!-- Project Dialog -->
    @if (showProjectDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingProject ? 'Editează' : 'Proiect Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nume Proiect</mat-label>
              <input matInput [(ngModel)]="projectForm.name">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="projectForm.description" rows="2"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="projectForm.status">
                  @for (s of projectStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Prioritate</mat-label>
                <mat-select [(ngModel)]="projectForm.priority">
                  @for (p of priorities; track p.value) {
                    <mat-option [value]="p.value">{{ p.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data Început</mat-label>
                <input matInput type="date" [(ngModel)]="projectForm.startDate">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Data Sfârșit</mat-label>
                <input matInput type="date" [(ngModel)]="projectForm.endDate">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Manager</mat-label>
                <input matInput [(ngModel)]="projectForm.managerName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Buget</mat-label>
                <input matInput type="number" [(ngModel)]="projectForm.budget">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Progres (%)</mat-label>
              <input matInput type="number" [(ngModel)]="projectForm.progress" max="100">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveProject()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Task Dialog -->
    @if (showTaskDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingTask ? 'Editează' : 'Task Nou' }}</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Titlu Task</mat-label>
              <input matInput [(ngModel)]="taskForm.title">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="taskForm.description" rows="2"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="taskForm.status">
                  @for (s of taskStatuses; track s.value) {
                    <mat-option [value]="s.value">{{ s.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Prioritate</mat-label>
                <mat-select [(ngModel)]="taskForm.priority">
                  @for (p of priorities; track p.value) {
                    <mat-option [value]="p.value">{{ p.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Assignat</mat-label>
                <input matInput [(ngModel)]="taskForm.assigneeName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Estimare (ore)</mat-label>
                <input matInput type="number" [(ngModel)]="taskForm.estimatedHours">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Data Început</mat-label>
                <input matInput type="date" [(ngModel)]="taskForm.startDate">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Termen</mat-label>
                <input matInput type="date" [(ngModel)]="taskForm.endDate">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Progres (%)</mat-label>
              <input matInput type="number" [(ngModel)]="taskForm.progress" max="100">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveTask()">Salvează</button>
          </div>
        </div>
      </div>
    }

    <!-- Milestone Dialog -->
    @if (showMilestoneDialog) {
      <div class="dialog-overlay" (click)="closeDialogs()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>Milestone Nou</h2>
            <button mat-icon-button (click)="closeDialogs()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dialog-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nume Milestone</mat-label>
              <input matInput [(ngModel)]="milestoneForm.name">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descriere</mat-label>
              <textarea matInput [(ngModel)]="milestoneForm.description" rows="2"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Termen</mat-label>
              <input matInput type="date" [(ngModel)]="milestoneForm.dueDate">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="closeDialogs()">Anulează</button>
            <button mat-raised-button color="primary" (click)="saveMilestone()">Salvează</button>
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
    .project-badge { background: #e3f2fd; padding: 8px 16px; border-radius: 16px; font-weight: 500; }
    
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
    .project-card { cursor: pointer; transition: transform 0.2s; }
    .project-card:hover, .project-card.selected { transform: translateY(-4px); border: 2px solid #2196f3; }
    .project-card mat-card-content { padding: 16px; }
    .project-status { display: flex; gap: 8px; margin-bottom: 12px; }
    .project-dates { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; }
    .project-dates mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .project-progress { margin-bottom: 12px; }
    .progress-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
    .project-manager { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px; }
    .project-manager mat-icon { font-size: 18px; width: 18px; height: 18px; }
    
    .table-container { overflow-x: auto; }
    .full-width-table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
    
    .milestones-list { display: flex; flex-direction: column; gap: 12px; }
    .milestone-item { padding: 16px; }
    .milestone-content { display: flex; align-items: center; gap: 16px; }
    .milestone-info { flex: 1; }
    .milestone-name { font-weight: 500; }
    .milestone-date { font-size: 14px; color: var(--text-secondary); }
    
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 500px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }
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
      .projects-grid { grid-template-columns: 1fr; }
    }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);

  // Data
  projects: Project[] = [];
  tasks: ProjectTask[] = [];
  milestones: Milestone[] = [];
  selectedProject: Project | null = null;

  selectedTab = 0;

  stats = {
    total: 0,
    active: 0,
    pendingTasks: 0,
    completed: 0
  };

  taskColumns = ['status', 'title', 'assignee', 'priority', 'dueDate', 'progress', 'actions'];

  // Dialog states
  showProjectDialog = false;
  showTaskDialog = false;
  showMilestoneDialog = false;

  editingProject: Project | null = null;
  editingTask: ProjectTask | null = null;

  // Forms
  projectForm: Partial<Project> = this.getEmptyProject();
  taskForm: Partial<ProjectTask> = this.getEmptyTask();
  milestoneForm: Partial<Milestone> = this.getEmptyMilestone();

  // Options
  projectStatuses = [
    { value: 'DRAFT', label: 'Schiță' },
    { value: 'PLANNING', label: 'Planificare' },
    { value: 'IN_PROGRESS', label: 'În Desfășurare' },
    { value: 'ON_HOLD', label: 'In Pauza' },
    { value: 'COMPLETED', label: 'Finalizat' },
    { value: 'CANCELLED', label: 'Anulat' }
  ];

  taskStatuses = [
    { value: 'TODO', label: 'De făcut' },
    { value: 'IN_PROGRESS', label: 'În Lucru' },
    { value: 'IN_REVIEW', label: 'În Revizuire' },
    { value: 'DONE', label: 'Finalizat' },
    { value: 'BLOCKED', label: 'Blocat' }
  ];

  priorities = [
    { value: 'LOW', label: 'Scăzută' },
    { value: 'MEDIUM', label: 'Medie' },
    { value: 'HIGH', label: 'Ridicată' },
    { value: 'CRITICAL', label: 'Critică' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projectService.getProjects().pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as Project[]); })
    ).subscribe((data) => {
      this.projects = data || [];
      this.updateStats();
    });
  }

  private updateStats() {
    this.stats.total = this.projects.length;
    this.stats.active = this.projects.filter(p => p.status === 'IN_PROGRESS').length;
    this.stats.completed = this.projects.filter(p => p.status === 'COMPLETED').length;
    this.stats.pendingTasks = this.projects.reduce((sum, _p) => sum + 3, 0);
  }

  selectProject(project: Project) {
    this.selectedProject = project;
    this.projectService.getTasks(project.id!).pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as ProjectTask[]); })
    ).subscribe((data) => {
      this.tasks = data || [];
    });
    this.projectService.getMilestones(project.id!).pipe(
      catchError(() => { this.showSnackBar('Eroare la incarcarea datelor'); return of([] as Milestone[]); })
    ).subscribe((data) => {
      this.milestones = data || [];
    });
    this.selectedTab = 1;
  }

  // Project
  openProjectDialog(project?: Project) {
    this.editingProject = project || null;
    this.projectForm = project ? { ...project } : this.getEmptyProject();
    this.showProjectDialog = true;
  }

  saveProject() {
    if (this.editingProject) {
      const index = this.projects.findIndex(p => p.id === this.editingProject!.id);
      if (index >= 0) this.projects[index] = { ...this.projects[index], ...this.projectForm };
      this.showSnackBar('Proiect actualizat');
    } else {
      const newProject = { ...this.projectForm, id: crypto.randomUUID(), progress: 0, isActive: true, createdAt: new Date().toISOString() } as Project;
      this.projects.push(newProject);
      this.stats.total++;
      if (newProject.status === 'IN_PROGRESS') this.stats.active++;
      this.showSnackBar('Proiect creat cu succes');
    }
    this.closeDialogs();
  }

  deleteProject(project: Project) {
    if (confirm('Sigur doriți să ștergeți proiectul?')) {
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.stats.total--;
      if (project.status === 'IN_PROGRESS') this.stats.active--;
      this.showSnackBar('Proiect șters');
    }
  }

  // Task
  openTaskDialog(task?: ProjectTask) {
    this.editingTask = task || null;
    this.taskForm = task ? { ...task } : this.getEmptyTask();
    if (!task && this.selectedProject) {
      this.taskForm.projectId = this.selectedProject.id;
    }
    this.showTaskDialog = true;
  }

  saveTask() {
    if (this.editingTask) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (index >= 0) this.tasks[index] = { ...this.tasks[index], ...this.taskForm };
      this.showSnackBar('Task actualizat');
    } else {
      const newTask = { ...this.taskForm, id: crypto.randomUUID(), progress: 0, isActive: true, createdAt: new Date().toISOString() } as ProjectTask;
      this.tasks.push(newTask);
      this.stats.pendingTasks++;
      this.showSnackBar('Task creat');
    }
    this.closeDialogs();
  }

  deleteTask(task: ProjectTask) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.stats.pendingTasks--;
    this.showSnackBar('Task șters');
  }

  // Milestone
  openMilestoneDialog() {
    this.milestoneForm = this.getEmptyMilestone();
    if (this.selectedProject) {
      this.milestoneForm.projectId = this.selectedProject.id;
    }
    this.showMilestoneDialog = true;
  }

  saveMilestone() {
    const newMilestone = { ...this.milestoneForm, id: crypto.randomUUID(), status: 'PENDING', isActive: true, createdAt: new Date().toISOString() } as Milestone;
    this.milestones.push(newMilestone);
    this.showSnackBar('Milestone creat');
    this.closeDialogs();
  }

  closeDialogs() {
    this.showProjectDialog = false;
    this.showTaskDialog = false;
    this.showMilestoneDialog = false;
    this.editingProject = null;
    this.editingTask = null;
  }

  // Labels
  getProjectStatusLabel(status: ProjectStatus): string {
    return this.projectStatuses.find(s => s.value === status)?.label || status;
  }

  getProjectStatusColor(status: ProjectStatus): string {
    if (status === 'IN_PROGRESS') return 'accent';
    if (status === 'COMPLETED') return 'accent';
    if (status === 'CANCELLED' || status === 'ON_HOLD') return 'warn';
    return '';
  }

  getTaskStatusLabel(status: TaskStatus): string {
    return this.taskStatuses.find(s => s.value === status)?.label || status;
  }

  getTaskStatusColor(status: TaskStatus): string {
    if (status === 'DONE') return 'accent';
    if (status === 'BLOCKED') return 'warn';
    if (status === 'IN_PROGRESS') return '';
    return '';
  }

  getPriorityLabel(priority: ProjectPriority | TaskPriority): string {
    return this.priorities.find(p => p.value === priority)?.label || priority;
  }

  getPriorityColor(priority: ProjectPriority | TaskPriority): string {
    if (priority === 'CRITICAL') return 'warn';
    if (priority === 'HIGH') return '';
    return 'accent';
  }

  getMilestoneStatusColor(status: string): string {
    if (status === 'COMPLETED') return '#4caf50';
    if (status === 'OVERDUE') return '#f44336';
    if (status === 'IN_PROGRESS') return '#2196f3';
    return '#9e9e9e';
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Închide', { duration: 3000 });
  }

  private getEmptyProject() {
    return { name: '', status: 'DRAFT' as ProjectStatus, priority: 'MEDIUM' as ProjectPriority, progress: 0, isActive: true };
  }

  private getEmptyTask() {
    return { title: '', status: 'TODO' as TaskStatus, priority: 'MEDIUM' as TaskPriority, progress: 0, isActive: true };
  }

  private getEmptyMilestone() {
    return { name: '', dueDate: '', status: 'PENDING' as const, isActive: true };
  }

}