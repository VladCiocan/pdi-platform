import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InfrastructureNetwork,
  InfrastructureAsset,
  InfrastructureIncident,
  InfrastructureStats,
  NetworkType,
  AssetType,
  IncidentStatus,
  Severity
} from '../models/infrastructure.model';

@Injectable({ providedIn: 'root' })
export class InfrastructureService {
  private readonly API_URL = `${environment.apiUrl}/infrastructure`;

  constructor(private http: HttpClient) {}

  // Networks
  getNetworks(type?: NetworkType): Observable<InfrastructureNetwork[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<InfrastructureNetwork[]>(`${this.API_URL}/networks`, { params });
  }

  getNetwork(id: string): Observable<InfrastructureNetwork> {
    return this.http.get<InfrastructureNetwork>(`${this.API_URL}/networks/${id}`);
  }

  createNetwork(network: Partial<InfrastructureNetwork>): Observable<InfrastructureNetwork> {
    return this.http.post<InfrastructureNetwork>(`${this.API_URL}/networks`, network);
  }

  updateNetwork(id: string, network: Partial<InfrastructureNetwork>): Observable<InfrastructureNetwork> {
    return this.http.put<InfrastructureNetwork>(`${this.API_URL}/networks/${id}`, network);
  }

  deleteNetwork(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/networks/${id}`);
  }

  // Assets
  getAssets(networkId?: string, type?: AssetType): Observable<InfrastructureAsset[]> {
    let params = new HttpParams();
    if (networkId) params = params.set('networkId', networkId);
    if (type) params = params.set('type', type);
    return this.http.get<InfrastructureAsset[]>(`${this.API_URL}/assets`, { params });
  }

  getAsset(id: string): Observable<InfrastructureAsset> {
    return this.http.get<InfrastructureAsset>(`${this.API_URL}/assets/${id}`);
  }

  createAsset(asset: Partial<InfrastructureAsset>): Observable<InfrastructureAsset> {
    return this.http.post<InfrastructureAsset>(`${this.API_URL}/assets`, asset);
  }

  updateAsset(id: string, asset: Partial<InfrastructureAsset>): Observable<InfrastructureAsset> {
    return this.http.put<InfrastructureAsset>(`${this.API_URL}/assets/${id}`, asset);
  }

  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/assets/${id}`);
  }

  // Incidents
  getIncidents(status?: IncidentStatus, severity?: Severity): Observable<InfrastructureIncident[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (severity) params = params.set('severity', severity);
    return this.http.get<InfrastructureIncident[]>(`${this.API_URL}/incidents`, { params });
  }

  getIncident(id: string): Observable<InfrastructureIncident> {
    return this.http.get<InfrastructureIncident>(`${this.API_URL}/incidents/${id}`);
  }

  createIncident(incident: Partial<InfrastructureIncident>): Observable<InfrastructureIncident> {
    return this.http.post<InfrastructureIncident>(`${this.API_URL}/incidents`, incident);
  }

  updateIncident(id: string, incident: Partial<InfrastructureIncident>): Observable<InfrastructureIncident> {
    return this.http.put<InfrastructureIncident>(`${this.API_URL}/incidents/${id}`, incident);
  }

  deleteIncident(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/incidents/${id}`);
  }

  // Stats
  getStats(): Observable<InfrastructureStats> {
    return this.http.get<InfrastructureStats>(`${this.API_URL}/stats`);
  }
}