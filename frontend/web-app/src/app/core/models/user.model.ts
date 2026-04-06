export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cnp?: string;
  userType: UserType;
  isActive: boolean;
  twoFactorEnabled: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  code: string;
  name: string;
  module: string;
}

export enum UserType {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  EMPLOYEE = 'EMPLOYEE'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requiresTwoFactor: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cnp?: string;
  userType: UserType;
}