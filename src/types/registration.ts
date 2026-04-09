export type AccountType = 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE';

export interface AccountTypeInfo {
  id: AccountType;
  title: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
  gradient: string;
}

export interface BusinessDetails {
  businessName: string;
  registrationNumber?: string;
  taxId?: string;
  businessType?: string;
  website?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface RegistrationData {
  accountType: AccountType | null;
  businessDetails: BusinessDetails;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  verificationCode: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    requiresVerification: boolean;
  };
}

export interface BusinessTypeOption {
  value: string;
  label: string;
  description: string;
}
