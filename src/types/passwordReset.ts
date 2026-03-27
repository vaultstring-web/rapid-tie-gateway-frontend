export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt?: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
  expiresAt?: string;
}

export interface PasswordValidationErrors {
  length?: string;
  uppercase?: string;
  lowercase?: string;
  number?: string;
  special?: string;
  confirm?: string;
}
