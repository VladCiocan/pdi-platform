// Project
export interface Project {
  id?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  endDate?: string;
  estimatedEndDate?: string;
  managerId?: string;
  managerName?: string;
  budget?: number;
  spentBudget?: number;
  progress: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectStatus = 'DRAFT' | 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Project Task
export interface ProjectTask {
  id?: string;
  projectId: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  dependencies?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Milestone
export interface Milestone {
  id?: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  status: MilestoneStatus;
  isActive: boolean;
  createdAt?: string;
}

export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

// Time Entry
export interface TimeEntry {
  id?: string;
  projectId: string;
  taskId?: string;
  userId: string;
  userName?: string;
  date: string;
  hours: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

// Project Document
export interface ProjectDocument {
  id?: string;
  projectId: string;
  title: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  documentType: string;
  uploadedBy?: string;
  uploadedAt?: string;
  isActive: boolean;
}

// Project Stats
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
  totalBudget: number;
  spentBudget: number;
}

// Gantt Data
export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string[];
  color?: string;
}

// Burndown Chart
export interface BurndownData {
  date: string;
  ideal: number;
  actual: number;
  remaining: number;
}