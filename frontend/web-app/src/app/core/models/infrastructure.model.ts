// Infrastructure Network
export interface InfrastructureNetwork {
  id?: string;
  networkType: NetworkType;
  name: string;
  description?: string;
  status: NetworkStatus;
  totalLength?: number;
  installationDate?: string;
  technicalSpecifications?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type NetworkType = 'WATER' | 'SEWERAGE' | 'ELECTRICITY' | 'GAS' | 'LIGHTING' | 'TELEPHONE' | 'INTERNET';
export type NetworkStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_REPAIR' | 'PLANNED';

// Infrastructure Asset
export interface InfrastructureAsset {
  id?: string;
  networkId?: string;
  assetType: AssetType;
  serialNumber?: string;
  name: string;
  technicalSpecifications?: string;
  manufacturer?: string;
  model?: string;
  installationDate?: string;
  warrantyExpiry?: string;
  status: AssetStatus;
  observations?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AssetType = 'PUMP' | 'VALVE' | 'METER' | 'HYDRANT' | 'TRANSFORMER' | 'POLE' | 'MANHOLE' | 'CABLE' | 'PIPE' | 'LIGHT_POINT' | 'SENSOR';
export type AssetStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_REPAIR' | 'DEFECTIVE' | 'DECOMMISSIONED';

// Infrastructure Incident
export interface InfrastructureIncident {
  id?: string;
  networkId?: string;
  assetId?: string;
  incidentType: IncidentType;
  severity: Severity;
  description: string;
  reportedBy?: string;
  reportedAt?: string;
  assignedTo?: string;
  assignedAt?: string;
  status: IncidentStatus;
  resolvedAt?: string;
  resolutionNotes?: string;
  observations?: string;
  isActive: boolean;
  createdAt?: string;
}

export type IncidentType = 'BREAKDOWN' | 'LEAK' | 'BLOCKAGE' | 'DAMAGE' | 'MALFUNCTION' | 'ACCIDENT' | 'PLANNED_WORK';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'NEW' | 'ACQUIRED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';

// Stats
export interface InfrastructureStats {
  networksCount: number;
  assetsCount: number;
  incidentsCount: number;
  criticalIncidentsCount: number;
}