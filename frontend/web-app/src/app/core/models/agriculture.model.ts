export interface AgricultureHousehold {
  id?: string;
  householdCode: string;
  ownerId: string;
  ownerName: string;
  addressId?: string;
  registrationDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgricultureMember {
  id?: string;
  householdId: string;
  personId?: string;
  firstName: string;
  lastName: string;
  cnp?: string;
  birthDate?: string;
  type: MemberType;
  relation?: FamilyRelation;
  idSeries?: string;
  idNumber?: string;
  idIssueDate?: string;
  idIssuedBy?: string;
  phone?: string;
  email?: string;
  observations?: string;
  isActive: boolean;
  createdAt?: string;
}

export type MemberType = 'OWNER' | 'MEMBER' | 'TENANT';
export type FamilyRelation = 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';

export interface AgricultureParcel {
  id?: string;
  parcelNumber?: string;
  householdId?: string;
  ownerId?: string;
  userId?: string;
  cadastralNumber?: string;
  landRegistryNumber?: string;
  area?: number;
  category: ParcelCategory;
  usageType?: UsageType;
  irrigationType?: string;
  observations?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ParcelCategory = 'ARABLE' | 'PASTURE' | 'FOREST' | 'VINEYARD' | 'ORCHARD' | 'OTHER';
export type UsageType = 'OWNED' | 'LEASED' | 'RENTED' | 'USED_FREE';

export interface AgricultureAnimal {
  id?: string;
  householdId: string;
  animalType: AnimalType;
  species?: string;
  breed?: string;
  tagNumber?: string;
  passportNumber?: string;
  birthDate?: string;
  sex?: string;
  quantity?: number;
  identificationNumber?: string;
  observations?: string;
  isActive: boolean;
  createdAt?: string;
}

export type AnimalType = 'BOVINE' | 'PORCINE' | 'OVINE' | 'CAPRINE' | 'EQUINE' | 'POULTRY' | 'RABBIT' | 'BEE' | 'OTHER';

export interface AgricultureMachine {
  id?: string;
  householdId: string;
  machineType: MachineType;
  registrationNumber?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  registrationDate?: string;
  registrationExpiry?: string;
  engineNumber?: string;
  chassisNumber?: string;
  horsePower?: number;
  observations?: string;
  isActive: boolean;
  createdAt?: string;
}

export type MachineType = 'TRACTOR' | 'COMBINE' | 'PLOW' | 'SEEDER' | 'SPRAYER' | 'HARVESTER' | 'TRAILER' | 'OTHER';

export interface AgricultureStats {
  householdsCount: number;
  parcelsCount: number;
  animalsCount: number;
  machinesCount: number;
  totalArea: number;
}