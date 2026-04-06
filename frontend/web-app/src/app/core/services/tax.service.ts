import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TaxCategory, TaxProperty, TaxLiability, TaxDeclaration,
  TaxPayment, TaxSummary, PaymentMethod
} from '../models';

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface PaymentRequest {
  taxLiabilityId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionId?: string;
  bankReference?: string;
}

@Injectable({ providedIn: 'root' })
export class TaxService {
  private readonly API_URL = `${environment.apiUrl}/taxes`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<TaxCategory[]> {
    return this.http.get<TaxCategory[]>(`${this.API_URL}/categories`);
  }

  getProperties(contributorId?: string): Observable<TaxProperty[]> {
    let params = new HttpParams();
    if (contributorId) params = params.set('contributorId', contributorId);
    return this.http.get<TaxProperty[]>(`${this.API_URL}/properties`, { params });
  }

  getProperty(id: string): Observable<TaxProperty> {
    return this.http.get<TaxProperty>(`${this.API_URL}/properties/${id}`);
  }

  createProperty(property: Partial<TaxProperty>): Observable<TaxProperty> {
    return this.http.post<TaxProperty>(`${this.API_URL}/properties`, property);
  }

  updateProperty(id: string, property: Partial<TaxProperty>): Observable<TaxProperty> {
    return this.http.put<TaxProperty>(`${this.API_URL}/properties/${id}`, property);
  }

  getLiabilities(contributorId?: string, status?: string, year?: number): Observable<TaxLiability[]> {
    let params = new HttpParams();
    if (contributorId) params = params.set('contributorId', contributorId);
    if (status) params = params.set('status', status);
    if (year) params = params.set('year', year.toString());
    return this.http.get<TaxLiability[]>(`${this.API_URL}/liabilities`, { params });
  }

  getLiability(id: string): Observable<TaxLiability> {
    return this.http.get<TaxLiability>(`${this.API_URL}/liabilities/${id}`);
  }

  getSummary(contributorId: string): Observable<TaxSummary> {
    return this.http.get<TaxSummary>(`${this.API_URL}/summary`, {
      params: { contributorId }
    });
  }

  calculateTax(propertyId: string, year: number): Observable<{ amount: number }> {
    return this.http.post<{ amount: number }>(`${this.API_URL}/calculate`, {
      propertyId,
      year
    });
  }

  getDeclarations(contributorId?: string, status?: string): Observable<TaxDeclaration[]> {
    let params = new HttpParams();
    if (contributorId) params = params.set('contributorId', contributorId);
    if (status) params = params.set('status', status);
    return this.http.get<TaxDeclaration[]>(`${this.API_URL}/declarations`, { params });
  }

  createDeclaration(declaration: Partial<TaxDeclaration>): Observable<TaxDeclaration> {
    return this.http.post<TaxDeclaration>(`${this.API_URL}/declarations`, declaration);
  }

  getPayments(contributorId: string): Observable<TaxPayment[]> {
    return this.http.get<TaxPayment[]>(`${this.API_URL}/payments`, {
      params: { contributorId }
    });
  }

  createPayment(payment: PaymentRequest): Observable<TaxPayment> {
    return this.http.post<TaxPayment>(`${this.API_URL}/payments`, payment);
  }

  initiateOnlinePayment(taxLiabilityId: string, amount: number): Observable<{ paymentUrl: string }> {
    return this.http.post<{ paymentUrl: string }>(`${this.API_URL}/payments/initiate`, {
      taxLiabilityId,
      amount
    });
  }

  getPaymentStatus(orderId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.API_URL}/payments/status/${orderId}`);
  }

  getOverdueLiabilities(): Observable<TaxLiability[]> {
    return this.http.get<TaxLiability[]>(`${this.API_URL}/liabilities/overdue`);
  }

  generateReport(type: 'rollRegister' | 'collections' | 'debts'): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reports/${type}`, {
      responseType: 'blob'
    });
  }
}