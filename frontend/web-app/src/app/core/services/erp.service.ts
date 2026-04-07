import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ErpEmployee,
  ErpPayroll,
  ErpAccountingEntry,
  ErpAccountingLine,
  ErpBudget,
  ErpBudgetExecution,
  ErpInventoryItem,
  ErpFixedAsset,
  ErpStats,
  EmployeeStatus,
  ItemStatus,
  FixedAssetStatus,
  BudgetStatus
} from '../models/erp.model';

@Injectable({ providedIn: 'root' })
export class ErpService {
  private readonly API_URL = `${environment.apiUrl}/erp`;

  constructor(private http: HttpClient) {}

  // === BUDGET ===
  getBudgets(year?: number, sourceCode?: string): Observable<ErpBudget[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (sourceCode) params = params.set('sourceCode', sourceCode);
    return this.http.get<ErpBudget[]>(`${this.API_URL}/budgets`, { params });
  }

  getBudget(id: string): Observable<ErpBudget> {
    return this.http.get<ErpBudget>(`${this.API_URL}/budgets/${id}`);
  }

  createBudget(budget: Partial<ErpBudget>): Observable<ErpBudget> {
    return this.http.post<ErpBudget>(`${this.API_URL}/budgets`, budget);
  }

  updateBudget(id: string, budget: Partial<ErpBudget>): Observable<ErpBudget> {
    return this.http.put<ErpBudget>(`${this.API_URL}/budgets/${id}`, budget);
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/budgets/${id}`);
  }

  // === BUDGET EXECUTION ===
  getBudgetExecutions(budgetId: string): Observable<ErpBudgetExecution[]> {
    const params = new HttpParams().set('budgetId', budgetId);
    return this.http.get<ErpBudgetExecution[]>(`${this.API_URL}/budget-executions`, { params });
  }

  createBudgetExecution(execution: Partial<ErpBudgetExecution>): Observable<ErpBudgetExecution> {
    return this.http.post<ErpBudgetExecution>(`${this.API_URL}/budget-executions`, execution);
  }

  // === HR - Employees ===
  getEmployees(department?: string, status?: EmployeeStatus): Observable<ErpEmployee[]> {
    let params = new HttpParams();
    if (department) params = params.set('department', department);
    if (status) params = params.set('status', status);
    return this.http.get<ErpEmployee[]>(`${this.API_URL}/hr/employees`, { params });
  }

  getEmployee(id: string): Observable<ErpEmployee> {
    return this.http.get<ErpEmployee>(`${this.API_URL}/hr/employees/${id}`);
  }

  createEmployee(employee: Partial<ErpEmployee>): Observable<ErpEmployee> {
    return this.http.post<ErpEmployee>(`${this.API_URL}/hr/employees`, employee);
  }

  updateEmployee(id: string, employee: Partial<ErpEmployee>): Observable<ErpEmployee> {
    return this.http.put<ErpEmployee>(`${this.API_URL}/hr/employees/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/hr/employees/${id}`);
  }

  // === HR - Payroll ===
  getPayrolls(employeeId: string, period?: string): Observable<ErpPayroll[]> {
    let params = new HttpParams().set('employeeId', employeeId);
    if (period) params = params.set('period', period);
    return this.http.get<ErpPayroll[]>(`${this.API_URL}/hr/payroll`, { params });
  }

  calculatePayroll(period: string): Observable<ErpPayroll[]> {
    const params = new HttpParams().set('period', period);
    return this.http.post<ErpPayroll[]>(`${this.API_URL}/hr/payroll/calculate`, null, { params });
  }

  approvePayroll(period: string): Observable<void> {
    const params = new HttpParams().set('period', period);
    return this.http.post<void>(`${this.API_URL}/hr/payroll/approve`, null, { params });
  }

  // === Accounting ===
  getAccountingEntries(journal?: string, documentType?: string): Observable<ErpAccountingEntry[]> {
    let params = new HttpParams();
    if (journal) params = params.set('journal', journal);
    if (documentType) params = params.set('documentType', documentType);
    return this.http.get<ErpAccountingEntry[]>(`${this.API_URL}/accounting/entries`, { params });
  }

  getAccountingEntry(id: string): Observable<ErpAccountingEntry> {
    return this.http.get<ErpAccountingEntry>(`${this.API_URL}/accounting/entries/${id}`);
  }

  createAccountingEntry(entry: Partial<ErpAccountingEntry>): Observable<ErpAccountingEntry> {
    return this.http.post<ErpAccountingEntry>(`${this.API_URL}/accounting/entries`, entry);
  }

  updateAccountingEntry(id: string, entry: Partial<ErpAccountingEntry>): Observable<ErpAccountingEntry> {
    return this.http.put<ErpAccountingEntry>(`${this.API_URL}/accounting/entries/${id}`, entry);
  }

  deleteAccountingEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/accounting/entries/${id}`);
  }

  getAccountingLines(entryId: string): Observable<ErpAccountingLine[]> {
    return this.http.get<ErpAccountingLine[]>(`${this.API_URL}/accounting/entries/${entryId}/lines`);
  }

  // === Inventory - Items ===
  getInventoryItems(category?: string, warehouseId?: string): Observable<ErpInventoryItem[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (warehouseId) params = params.set('warehouseId', warehouseId);
    return this.http.get<ErpInventoryItem[]>(`${this.API_URL}/inventory/items`, { params });
  }

  getInventoryItem(id: string): Observable<ErpInventoryItem> {
    return this.http.get<ErpInventoryItem>(`${this.API_URL}/inventory/items/${id}`);
  }

  createInventoryItem(item: Partial<ErpInventoryItem>): Observable<ErpInventoryItem> {
    return this.http.post<ErpInventoryItem>(`${this.API_URL}/inventory/items`, item);
  }

  updateInventoryItem(id: string, item: Partial<ErpInventoryItem>): Observable<ErpInventoryItem> {
    return this.http.put<ErpInventoryItem>(`${this.API_URL}/inventory/items/${id}`, item);
  }

  deleteInventoryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/inventory/items/${id}`);
  }

  // === Inventory - Fixed Assets ===
  getFixedAssets(assetCategory?: string, status?: FixedAssetStatus): Observable<ErpFixedAsset[]> {
    let params = new HttpParams();
    if (assetCategory) params = params.set('assetCategory', assetCategory);
    if (status) params = params.set('status', status);
    return this.http.get<ErpFixedAsset[]>(`${this.API_URL}/inventory/assets`, { params });
  }

  getFixedAsset(id: string): Observable<ErpFixedAsset> {
    return this.http.get<ErpFixedAsset>(`${this.API_URL}/inventory/assets/${id}`);
  }

  createFixedAsset(asset: Partial<ErpFixedAsset>): Observable<ErpFixedAsset> {
    return this.http.post<ErpFixedAsset>(`${this.API_URL}/inventory/assets`, asset);
  }

  updateFixedAsset(id: string, asset: Partial<ErpFixedAsset>): Observable<ErpFixedAsset> {
    return this.http.put<ErpFixedAsset>(`${this.API_URL}/inventory/assets/${id}`, asset);
  }

  deleteFixedAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/inventory/assets/${id}`);
  }

  calculateDepreciation(id: string): Observable<ErpFixedAsset> {
    return this.http.post<ErpFixedAsset>(`${this.API_URL}/inventory/assets/${id}/depreciate`, {});
  }

  // === Stats ===
  getStats(): Observable<ErpStats> {
    return this.http.get<ErpStats>(`${this.API_URL}/stats`);
  }
}