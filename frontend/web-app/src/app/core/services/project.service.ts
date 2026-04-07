import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Project,
  ProjectTask,
  Milestone,
  TimeEntry,
  ProjectDocument,
  ProjectStats,
  GanttTask,
  BurndownData,
  ProjectStatus,
  TaskStatus
} from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly API_URL = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // Projects
  getProjects(status?: ProjectStatus, managerId?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (managerId) params = params.set('managerId', managerId);
    return this.http.get<Project[]>(`${this.API_URL}`, { params });
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/${id}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.API_URL}`, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Tasks
  getTasks(projectId: string): Observable<ProjectTask[]> {
    return this.http.get<ProjectTask[]>(`${this.API_URL}/${projectId}/tasks`);
  }

  createTask(projectId: string, task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.post<ProjectTask>(`${this.API_URL}/${projectId}/tasks`, task);
  }

  updateTask(projectId: string, taskId: string, task: Partial<ProjectTask>): Observable<ProjectTask> {
    return this.http.put<ProjectTask>(`${this.API_URL}/${projectId}/tasks/${taskId}`, task);
  }

  deleteTask(projectId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${projectId}/tasks/${taskId}`);
  }

  // Milestones
  getMilestones(projectId: string): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.API_URL}/${projectId}/milestones`);
  }

  createMilestone(projectId: string, milestone: Partial<Milestone>): Observable<Milestone> {
    return this.http.post<Milestone>(`${this.API_URL}/${projectId}/milestones`, milestone);
  }

  // Time Entries
  logTime(projectId: string, entry: Partial<TimeEntry>): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.API_URL}/${projectId}/time-entries`, entry);
  }

  getTimeReport(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${projectId}/time-report`);
  }

  // Gantt
  getGanttData(projectId: string): Observable<GanttTask[]> {
    return this.http.get<GanttTask[]>(`${this.API_URL}/${projectId}/gantt`);
  }

  // Burndown
  getBurndownData(projectId: string): Observable<BurndownData[]> {
    return this.http.get<BurndownData[]>(`${this.API_URL}/${projectId}/burndown`);
  }

  // Documents
  getDocuments(projectId: string): Observable<ProjectDocument[]> {
    return this.http.get<ProjectDocument[]>(`${this.API_URL}/${projectId}/documents`);
  }

  // Budget
  getBudget(projectId: string): Observable<{ allocated: number; spent: number; remaining: number }> {
    return this.http.get<any>(`${this.API_URL}/${projectId}/budget`);
  }

  // Stats
  getStats(): Observable<ProjectStats> {
    return this.http.get<ProjectStats>(`${this.API_URL}/stats`);
  }
}