export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role:
    | 'MERCHANT'
    | 'ORGANIZER'
    | 'EMPLOYEE'
    | 'APPROVER'
    | 'FINANCE_OFFICER'
    | 'ADMIN'
    | 'COMPLIANCE'
    | string;
  merchant?: any;
  organizer?: any;
  employee?: any;
  approver?: any;
  financeOfficer?: any;
  admin?: any;
}

export interface SessionData {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}
