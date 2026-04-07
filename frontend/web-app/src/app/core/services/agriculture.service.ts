import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AgricultureHousehold,
  AgricultureMember,
  AgricultureParcel,
  AgricultureAnimal,
  AgricultureMachine,
  AgricultureStats
} from '../models/agriculture.model';

@Injectable({ providedIn: 'root' })
export class AgricultureService {
  private readonly API_URL = `${environment.apiUrl}/agriculture`;

  constructor(private http: HttpClient) {}

  // Households
  getHouseholds(ownerId?: string): Observable<AgricultureHousehold[]> {
    let params = new HttpParams();
    if (ownerId) params = params.set('ownerId', ownerId);
    return this.http.get<AgricultureHousehold[]>(`${this.API_URL}/households`, { params });
  }

  getHousehold(id: string): Observable<AgricultureHousehold> {
    return this.http.get<AgricultureHousehold>(`${this.API_URL}/households/${id}`);
  }

  createHousehold(household: Partial<AgricultureHousehold>): Observable<AgricultureHousehold> {
    return this.http.post<AgricultureHousehold>(`${this.API_URL}/households`, household);
  }

  updateHousehold(id: string, household: Partial<AgricultureHousehold>): Observable<AgricultureHousehold> {
    return this.http.put<AgricultureHousehold>(`${this.API_URL}/households/${id}`, household);
  }

  deleteHousehold(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/households/${id}`);
  }

  // Parcels
  getParcels(householdId?: string): Observable<AgricultureParcel[]> {
    let params = new HttpParams();
    if (householdId) params = params.set('householdId', householdId);
    return this.http.get<AgricultureParcel[]>(`${this.API_URL}/parcels`, { params });
  }

  createParcel(parcel: Partial<AgricultureParcel>): Observable<AgricultureParcel> {
    return this.http.post<AgricultureParcel>(`${this.API_URL}/parcels`, parcel);
  }

  updateParcel(id: string, parcel: Partial<AgricultureParcel>): Observable<AgricultureParcel> {
    return this.http.put<AgricultureParcel>(`${this.API_URL}/parcels/${id}`, parcel);
  }

  deleteParcel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/parcels/${id}`);
  }

  // Members
  getMembers(householdId?: string): Observable<AgricultureMember[]> {
    let params = new HttpParams();
    if (householdId) params = params.set('householdId', householdId);
    return this.http.get<AgricultureMember[]>(`${this.API_URL}/members`, { params });
  }

  createMember(member: Partial<AgricultureMember>): Observable<AgricultureMember> {
    return this.http.post<AgricultureMember>(`${this.API_URL}/members`, member);
  }

  updateMember(id: string, member: Partial<AgricultureMember>): Observable<AgricultureMember> {
    return this.http.put<AgricultureMember>(`${this.API_URL}/members/${id}`, member);
  }

  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/members/${id}`);
  }

  // Animals
  getAnimals(householdId?: string): Observable<AgricultureAnimal[]> {
    let params = new HttpParams();
    if (householdId) params = params.set('householdId', householdId);
    return this.http.get<AgricultureAnimal[]>(`${this.API_URL}/animals`, { params });
  }

  createAnimal(animal: Partial<AgricultureAnimal>): Observable<AgricultureAnimal> {
    return this.http.post<AgricultureAnimal>(`${this.API_URL}/animals`, animal);
  }

  updateAnimal(id: string, animal: Partial<AgricultureAnimal>): Observable<AgricultureAnimal> {
    return this.http.put<AgricultureAnimal>(`${this.API_URL}/animals/${id}`, animal);
  }

  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/animals/${id}`);
  }

  // Machines
  getMachines(householdId?: string): Observable<AgricultureMachine[]> {
    let params = new HttpParams();
    if (householdId) params = params.set('householdId', householdId);
    return this.http.get<AgricultureMachine[]>(`${this.API_URL}/machines`, { params });
  }

  createMachine(machine: Partial<AgricultureMachine>): Observable<AgricultureMachine> {
    return this.http.post<AgricultureMachine>(`${this.API_URL}/machines`, machine);
  }

  updateMachine(id: string, machine: Partial<AgricultureMachine>): Observable<AgricultureMachine> {
    return this.http.put<AgricultureMachine>(`${this.API_URL}/machines/${id}`, machine);
  }

  deleteMachine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/machines/${id}`);
  }

  // Stats
  getStats(): Observable<AgricultureStats> {
    return this.http.get<AgricultureStats>(`${this.API_URL}/stats`);
  }
}