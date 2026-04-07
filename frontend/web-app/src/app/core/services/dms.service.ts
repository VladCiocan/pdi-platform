import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DmsFolder,
  DmsDocument,
  DmsDocumentVersion,
  DmsDocumentMetadata,
  DmsWorkflow,
  DmsWorkflowInstance,
  DmsStats,
  DocumentStatus
} from '../models/dms.model';

@Injectable({ providedIn: 'root' })
export class DmsService {
  private readonly API_URL = `${environment.apiUrl}/dms`;

  constructor(private http: HttpClient) {}

  // === FOLDERS ===
  getRootFolders(): Observable<DmsFolder[]> {
    return this.http.get<DmsFolder[]>(`${this.API_URL}/folders`);
  }

  getChildFolders(parentId: string): Observable<DmsFolder[]> {
    return this.http.get<DmsFolder[]>(`${this.API_URL}/folders/${parentId}/children`);
  }

  getFolder(id: string): Observable<DmsFolder> {
    return this.http.get<DmsFolder>(`${this.API_URL}/folders/${id}`);
  }

  createFolder(folder: Partial<DmsFolder>): Observable<DmsFolder> {
    return this.http.post<DmsFolder>(`${this.API_URL}/folders`, folder);
  }

  updateFolder(id: string, folder: Partial<DmsFolder>): Observable<DmsFolder> {
    return this.http.put<DmsFolder>(`${this.API_URL}/folders/${id}`, folder);
  }

  deleteFolder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/folders/${id}`);
  }

  // === DOCUMENTS ===
  getDocuments(folderId?: string, status?: DocumentStatus, search?: string, documentType?: string): Observable<DmsDocument[]> {
    let params = new HttpParams();
    if (folderId) params = params.set('folderId', folderId);
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    if (documentType) params = params.set('documentType', documentType);
    return this.http.get<DmsDocument[]>(`${this.API_URL}/documents`, { params });
  }

  getDocument(id: string): Observable<DmsDocument> {
    return this.http.get<DmsDocument>(`${this.API_URL}/documents/${id}`);
  }

  createDocument(document: Partial<DmsDocument>): Observable<DmsDocument> {
    return this.http.post<DmsDocument>(`${this.API_URL}/documents`, document);
  }

  updateDocument(id: string, document: Partial<DmsDocument>): Observable<DmsDocument> {
    return this.http.put<DmsDocument>(`${this.API_URL}/documents/${id}`, document);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/documents/${id}`);
  }

  // === DOCUMENT VERSIONS ===
  getVersions(documentId: string): Observable<DmsDocumentVersion[]> {
    return this.http.get<DmsDocumentVersion[]>(`${this.API_URL}/documents/${documentId}/versions`);
  }

  getVersion(documentId: string, version: number): Observable<DmsDocumentVersion> {
    return this.http.get<DmsDocumentVersion>(`${this.API_URL}/documents/${documentId}/versions/${version}`);
  }

  // Upload file version (for MinIO/S3 storage)
  uploadFileVersion(
    documentId: string,
    file: File,
    changeDescription?: string
  ): Observable<DmsDocument> {
    const formData = new FormData();
    formData.append('file', file);
    if (changeDescription) {
      formData.append('changeDescription', changeDescription);
    }

    // Note: The backend expects different parameters, this is a simplified version
    // In a real implementation, you'd first get a pre-signed URL from the backend
    // then upload directly to MinIO/S3
    return this.http.post<DmsDocument>(
      `${this.API_URL}/documents/${documentId}/upload`,
      formData,
      {
        params: new HttpParams()
          .set('filePath', file.name)
          .set('fileSize', file.size.toString())
          .set('contentType', file.type || 'application/octet-stream')
          .set('checksum', ''),
        reportProgress: true
      }
    );
  }

  // === DOCUMENT METADATA ===
  getMetadata(documentId: string): Observable<DmsDocumentMetadata[]> {
    return this.http.get<DmsDocumentMetadata[]>(`${this.API_URL}/documents/${documentId}/metadata`);
  }

  addMetadata(documentId: string, key: string, value: string, isIndexable: boolean = true): Observable<DmsDocument> {
    const params = new HttpParams()
      .set('key', key)
      .set('value', value)
      .set('isIndexable', isIndexable.toString());
    return this.http.post<DmsDocument>(`${this.API_URL}/documents/${documentId}/metadata`, {}, { params });
  }

  deleteMetadata(documentId: string, metadataId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/documents/${documentId}/metadata/${metadataId}`);
  }

  // === WORKFLOWS ===
  getWorkflows(): Observable<DmsWorkflow[]> {
    return this.http.get<DmsWorkflow[]>(`${this.API_URL}/workflows`);
  }

  getWorkflow(id: string): Observable<DmsWorkflow> {
    return this.http.get<DmsWorkflow>(`${this.API_URL}/workflows/${id}`);
  }

  createWorkflow(workflow: Partial<DmsWorkflow>): Observable<DmsWorkflow> {
    return this.http.post<DmsWorkflow>(`${this.API_URL}/workflows`, workflow);
  }

  updateWorkflow(id: string, workflow: Partial<DmsWorkflow>): Observable<DmsWorkflow> {
    return this.http.put<DmsWorkflow>(`${this.API_URL}/workflows/${id}`, workflow);
  }

  deleteWorkflow(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/workflows/${id}`);
  }

  // === WORKFLOW INSTANCES ===
  getWorkflowInstances(workflowId?: string, documentId?: string): Observable<DmsWorkflowInstance[]> {
    let params = new HttpParams();
    if (workflowId) params = params.set('workflowId', workflowId);
    if (documentId) params = params.set('documentId', documentId);
    return this.http.get<DmsWorkflowInstance[]>(`${this.API_URL}/workflow-instances`, { params });
  }

  startWorkflow(workflowId: string, documentId: string): Observable<DmsWorkflowInstance> {
    return this.http.post<DmsWorkflowInstance>(`${this.API_URL}/workflow-instances`, {
      workflowId,
      documentId
    });
  }

  getWorkflowInstance(id: string): Observable<DmsWorkflowInstance> {
    return this.http.get<DmsWorkflowInstance>(`${this.API_URL}/workflow-instances/${id}`);
  }

  cancelWorkflowInstance(id: string): Observable<DmsWorkflowInstance> {
    return this.http.post<DmsWorkflowInstance>(`${this.API_URL}/workflow-instances/${id}/cancel`, {});
  }

  // === WORKFLOW TASKS ===
  getWorkflowTasks(assigneeId?: string, status?: string): Observable<any[]> {
    let params = new HttpParams();
    if (assigneeId) params = params.set('assigneeId', assigneeId);
    if (status) params = params.set('status', status);
    return this.http.get<any[]>(`${this.API_URL}/workflow-tasks`, { params });
  }

  approveTask(taskId: string, comment?: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/workflow-tasks/${taskId}/approve`, {
      comment
    });
  }

  rejectTask(taskId: string, comment: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/workflow-tasks/${taskId}/reject`, {
      comment
    });
  }

  completeTask(taskId: string, data?: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/workflow-tasks/${taskId}/complete`, data || {});
  }

  // === SEARCH ===
  searchDocuments(query: string): Observable<DmsDocument[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<DmsDocument[]>(`${this.API_URL}/documents`, { params });
  }

  // === DOWNLOAD ===
  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  downloadVersion(documentId: string, version: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/documents/${documentId}/versions/${version}/download`, {
      responseType: 'blob'
    });
  }

  // === STATS ===
  getStats(): Observable<DmsStats> {
    return this.http.get<DmsStats>(`${this.API_URL}/stats`);
  }
}