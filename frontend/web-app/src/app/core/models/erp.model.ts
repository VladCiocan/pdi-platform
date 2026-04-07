// ============ HR - Employees ============
export interface ErpEmployee {
  id?: string;
  cnp: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  idCardNumber?: string;
  idCardIssuedBy?: string;
  idCardDate?: string;
  employmentType: EmploymentType;
  position?: string;
  department?: string;
  contractNumber?: string;
  contractType?: string;
  hireDate?: string;
  terminationDate?: string;
  status: EmployeeStatus;
  baseSalary?: number;
  grade?: number;
  workSchedule?: string;
  managerId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERIM';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';

// ============ HR - Payroll ============
export interface ErpPayroll {
  id?: string;
  employeeId: string;
  periodYear: number;
  periodMonth: number;
  baseSalary: number;
  workDays: number;
  workedDays: number;
  overtimeHours?: number;
  overtimeAmount?: number;
  bonuses?: number;
  deductions?: number;
  grossSalary: number;
  taxIncome?: number;
  socialContribution?: number;
  healthContribution?: number;
  netSalary: number;
  paymentDate?: string;
  paymentStatus: PayrollStatus;
  isActive: boolean;
  createdAt?: string;
}

export type PayrollStatus = 'CALCULATED' | 'APPROVED' | 'PAID' | 'Cancelled';

// ============ Accounting ============
export interface ErpAccountingEntry {
  id?: string;
  journal?: string;
  entryDate: string;
  documentNumber?: string;
  documentType?: string;
  description?: string;
  totalDebit?: number;
  totalCredit?: number;
  isPosted: boolean;
  postedAt?: string;
  isReversed: boolean;
  reversedBy?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ErpAccountingLine {
  id?: string;
  entryId: string;
  accountCode: string;
  accountName?: string;
  debitAmount?: number;
  creditAmount?: number;
  description?: string;
}

// ============ Budget ============
export interface ErpBudget {
  id?: string;
  year: number;
  sourceCode?: string;
  classificationCode?: string;
  chapter?: string;
  article?: string;
  paragraph?: string;
  authorizedCredit?: number;
  budgetaryCredit?: number;
  revisedCredit?: number;
  status: BudgetStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BudgetStatus = 'DRAFT' | 'APPROVED' | 'REVISED' | 'CLOSED';

export interface ErpBudgetExecution {
  id?: string;
  budgetId: string;
  periodMonth: number;
  committedAmount?: number;
  paidAmount?: number;
  availableAmount?: number;
  executionStatus: ExecutionStatus;
  isActive: boolean;
}

export type ExecutionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_REVISION';

// ============ Inventory ============
export interface ErpInventoryItem {
  id?: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  unitOfMeasure?: string;
  quantity?: number;
  unitPrice?: number;
  totalValue?: number;
  inventoryMethod: InventoryMethod;
  warehouseId?: string;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  status: ItemStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type InventoryMethod = 'FIFO' | 'LIFO' | 'PMP';
export type ItemStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export interface ErpFixedAsset {
  id?: string;
  code: string;
  name: string;
  category?: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  usefulYears?: number;
  depreciationRate?: number;
  accumulatedDepreciation?: number;
  netValue?: number;
  location?: string;
  status: FixedAssetStatus;
  isActive: boolean;
}

export type FixedAssetStatus = 'IN_USE' | 'IN_STORAGE' | 'UNDER_MAINTENANCE' | 'DISPOSED';

// ============ Stats ============
export interface ErpStats {
  employeesCount: number;
  payrollThisMonth: number;
  budgetUtilization: number;
  inventoryValue: number;
  totalAssets: number;
}