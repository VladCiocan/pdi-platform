// DMS Folder
export interface DmsFolder {
  id?: string;
  parentId?: string;
  name: string;
  path?: string;
  ownerId?: string;
  metadata?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: DmsFolder[];
  documents?: DmsDocument[];
}

// DMS Document
export interface DmsDocument {
  id?: string;
  folderId?: string;
  documentType?: string;
  title: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  contentType?: string;
  checksum?: string;
  version: number;
  status: DocumentStatus;
  ownerId?: string;
  description?: string;
  tags?: string;
  retentionDate?: string;
  retentionPolicy?: RetentionPolicy;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type RetentionPolicy = 'PERMANENT' | 'TEMPORARY' | 'CUSTOM';

// DMS Document Version
export interface DmsDocumentVersion {
  id?: string;
  documentId: string;
  version: number;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  contentType?: string;
  checksum?: string;
  changeDescription?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  isActive: boolean;
}

// DMS Document Metadata
export interface DmsDocumentMetadata {
  id?: string;
  documentId: string;
  key: string;
  value: string;
  isIndexable: boolean;
  isActive: boolean;
  createdAt?: string;
}

// DMS Workflow
export interface DmsWorkflow {
  id?: string;
  name: string;
  description?: string;
  workflowType?: string;
  status: WorkflowStatus;
  bpmnDefinition?: string;
  isActive: boolean;
  createdAt?: string;
}

export type WorkflowStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

// DMS Workflow Instance
export interface DmsWorkflowInstance {
  id?: string;
  workflowId: string;
  documentId?: string;
  currentStep?: string;
  status: InstanceStatus;
  startedBy?: string;
  startedAt?: string;
  completedAt?: string;
  isActive: boolean;
}

export type InstanceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// DMS Stats
export interface DmsStats {
  totalFolders: number;
  totalDocuments: number;
  storageUsed: number;
  pendingApprovals: number;
}