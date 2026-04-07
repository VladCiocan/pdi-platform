// Urbanism Register
export interface UrbanismRegister {
  id?: string;
  registerType: RegisterType;
  registerNumber?: string;
  sessionDate?: string;
  status: RegisterStatus;
  observations?: string;
  totalRecords?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type RegisterType = 'MINUTES' | 'CU' | 'AC_AD' | 'CNS';
export type RegisterStatus = 'OPEN' | 'CLOSED' | 'ARCHIVED';

// Unitate Teritorială de Referință (UTR)
export interface UrbanismUTR {
  id?: string;
  code: string;
  name: string;
  potCode?: number;
  cutCode?: number;
  maxBuildHeight?: number;
  potPercentage?: number;
  cutIndex?: number;
  zoningType?: string;
  regulations?: string;
  typography?: string;
  minLotArea?: number;
  maxFloors?: number;
  additionalConditions?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Certificate de Urbanism (CU)
export interface CertificateUrbanism {
  id?: string;
  cuNumber: string;
  registerId?: string;
  applicantId: string;
  utrId?: string;
  addressId?: string;
  applicationDate?: string;
  issueDate?: string;
  expiryDate?: string;
  status: CUStatus;
  purpose?: string;
  legalRegime?: string;
  urbanismCertificateType?: string;
  content?: string;
  conditions?: string;
  observations?: string;
  issuedBy?: string;
  taxAmount?: number;
  taxPaid: boolean;
  documentPath?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CUStatus = 'IN_PROGRESS' | 'PENDING_TAX' | 'ISSUED' | 'EXPIRED' | 'CANCELLED';

// Autorizații de Construire (AC)
export interface Authorization {
  id?: string;
  acNumber: string;
  cuId?: string;
  registerId?: string;
  applicantId: string;
  utrId?: string;
  authorizationType: AuthorizationType;
  applicationDate?: string;
  issueDate?: string;
  expiryDate?: string;
  status: ACStatus;
  constructionType?: string;
  destination?: string;
  builtArea?: number;
  totalArea?: number;
  height?: number;
  floors?: number;
  rooms?: number;
  constructionValue?: number;
  technicalConditions?: string;
  urbanismConditions?: string;
  observations?: string;
  issuedBy?: string;
  taxAmount?: number;
  regularizationTax?: number;
  taxPaid: boolean;
  documentPath?: string;
  completionDate?: string;
  receivingDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AuthorizationType = 'CONSTRUIRE' | 'DESFIINTARE';
export type ACStatus = 'IN_PROGRESS' | 'PENDING_TAX' | 'ISSUED' | 'IN_EXECUTION' | 'COMPLETED' | 'RECEIVED' | 'EXPIRED' | 'CANCELLED';

// Certificate Nomenclatură Stradală (CNS)
export interface CertificateNomenclature {
  id?: string;
  cnsNumber: string;
  registerId?: string;
  applicantId: string;
  addressId?: string;
  applicationDate?: string;
  issueDate?: string;
  streetName?: string;
  streetNumber?: string;
  block?: string;
  district?: string;
  status: CNSStatus;
  observations?: string;
  issuedBy?: string;
  taxAmount?: number;
  taxPaid: boolean;
  documentPath?: string;
  isActive: boolean;
  createdAt?: string;
}

export type CNSStatus = 'IN_PROGRESS' | 'PENDING_TAX' | 'ISSUED' | 'CANCELLED';

// Stats
export interface UrbanismStats {
  registersCount: number;
  utrsCount: number;
  certificatesCount: number;
  authorizationsCount: number;
}