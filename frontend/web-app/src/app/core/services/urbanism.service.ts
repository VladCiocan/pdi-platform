import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UrbanismRegister,
  UrbanismUTR,
  CertificateUrbanism,
  Authorization,
  CertificateNomenclature,
  UrbanismStats,
  RegisterType,
  CUStatus,
  ACStatus
} from '../models/urbanism.model';

@Injectable({ providedIn: 'root' })
export class UrbanismService {
  private readonly API_URL = `${environment.apiUrl}/urbanism`;

  constructor(private http: HttpClient) {}

  // Registers
  getRegisters(type?: RegisterType): Observable<UrbanismRegister[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<UrbanismRegister[]>(`${this.API_URL}/registers`, { params });
  }

  createRegister(register: Partial<UrbanismRegister>): Observable<UrbanismRegister> {
    return this.http.post<UrbanismRegister>(`${this.API_URL}/registers`, register);
  }

  updateRegister(id: string, register: Partial<UrbanismRegister>): Observable<UrbanismRegister> {
    return this.http.put<UrbanismRegister>(`${this.API_URL}/registers/${id}`, register);
  }

  deleteRegister(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/registers/${id}`);
  }

  // UTRs
  getUTRs(): Observable<UrbanismUTR[]> {
    return this.http.get<UrbanismUTR[]>(`${this.API_URL}/utrs`);
  }

  createUTR(utr: Partial<UrbanismUTR>): Observable<UrbanismUTR> {
    return this.http.post<UrbanismUTR>(`${this.API_URL}/utrs`, utr);
  }

  updateUTR(id: string, utr: Partial<UrbanismUTR>): Observable<UrbanismUTR> {
    return this.http.put<UrbanismUTR>(`${this.API_URL}/utrs/${id}`, utr);
  }

  deleteUTR(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/utrs/${id}`);
  }

  // Certificates of Urbanism (CU)
  getCertificates(applicantId?: string, status?: CUStatus): Observable<CertificateUrbanism[]> {
    let params = new HttpParams();
    if (applicantId) params = params.set('applicantId', applicantId);
    if (status) params = params.set('status', status);
    return this.http.get<CertificateUrbanism[]>(`${this.API_URL}/certificates-urbanism`, { params });
  }

  createCertificate(cu: Partial<CertificateUrbanism>): Observable<CertificateUrbanism> {
    return this.http.post<CertificateUrbanism>(`${this.API_URL}/certificates-urbanism`, cu);
  }

  updateCertificate(id: string, cu: Partial<CertificateUrbanism>): Observable<CertificateUrbanism> {
    return this.http.put<CertificateUrbanism>(`${this.API_URL}/certificates-urbanism/${id}`, cu);
  }

  deleteCertificate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/certificates-urbanism/${id}`);
  }

  // Authorizations (AC)
  getAuthorizations(applicantId?: string, status?: ACStatus): Observable<Authorization[]> {
    let params = new HttpParams();
    if (applicantId) params = params.set('applicantId', applicantId);
    if (status) params = params.set('status', status);
    return this.http.get<Authorization[]>(`${this.API_URL}/authorizations`, { params });
  }

  createAuthorization(ac: Partial<Authorization>): Observable<Authorization> {
    return this.http.post<Authorization>(`${this.API_URL}/authorizations`, ac);
  }

  updateAuthorization(id: string, ac: Partial<Authorization>): Observable<Authorization> {
    return this.http.put<Authorization>(`${this.API_URL}/authorizations/${id}`, ac);
  }

  deleteAuthorization(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/authorizations/${id}`);
  }

  // Certificate Nomenclature (CNS)
  getNomenclatures(applicantId?: string): Observable<CertificateNomenclature[]> {
    let params = new HttpParams();
    if (applicantId) params = params.set('applicantId', applicantId);
    return this.http.get<CertificateNomenclature[]>(`${this.API_URL}/certificates-nomenclature`, { params });
  }

  createNomenclature(cns: Partial<CertificateNomenclature>): Observable<CertificateNomenclature> {
    return this.http.post<CertificateNomenclature>(`${this.API_URL}/certificates-nomenclature`, cns);
  }

  // Stats
  getStats(): Observable<UrbanismStats> {
    return this.http.get<UrbanismStats>(`${this.API_URL}/stats`);
  }
}