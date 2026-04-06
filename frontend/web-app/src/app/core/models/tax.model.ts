export interface TaxCategory {
  id: string;
  code: string;
  name: string;
  taxType: TaxType;
  taxRate: number;
  calculationMethod: CalculationMethod;
  validFrom: string;
  validTo?: string;
}

export enum TaxType {
  BUILDING = 'BUILDING',
  LAND = 'LAND',
  VEHICLE = 'VEHICLE',
  OTHER = 'OTHER'
}

export enum CalculationMethod {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  FORMULA = 'FORMULA'
}

export interface TaxProperty {
  id: string;
  propertyType: PropertyType;
  ownerId: string;
  addressId: string;
  cadastralNumber: string;
  area: number;
  constructionYear?: number;
  zone: string;
  streetZoneMultiplier: number;
  propertyValue?: number;
  isExempt: boolean;
}

export enum PropertyType {
  CLADIRE = 'CLADIRE',
  TEREN = 'TEREN',
  AUTO = 'AUTO'
}

export interface TaxLiability {
  id: string;
  contributorId: string;
  propertyId: string;
  categoryId: string;
  year: number;
  taxAmount: number;
  penaltyAmount: number;
  discountAmount: number;
  totalDue: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: LiabilityStatus;
  isActive: boolean;
}

export enum LiabilityStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  ENFORCED = 'ENFORCED'
}

export interface TaxDeclaration {
  id: string;
  declarationNumber: string;
  contributorId: string;
  propertyId: string;
  declarationType: DeclarationType;
  status: DeclarationStatus;
  declarationData: Record<string, any>;
  submittedAt: string;
  validatedAt?: string;
}

export enum DeclarationType {
  INITIAL = 'INITIAL',
  MODIFICATION = 'MODIFICATION',
  ANNEX = 'ANNEX'
}

export enum DeclarationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED'
}

export interface TaxPayment {
  id: string;
  contributorId: string;
  propertyId?: string;
  taxLiabilityId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionId?: string;
  bankReference?: string;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE'
}

export interface TaxSummary {
  totalDue: number;
  totalPaid: number;
  totalOverdue: number;
  liabilitiesCount: number;
  propertiesCount: number;
}