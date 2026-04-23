export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  otpauthUrl: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
  trustDevice?: boolean;
  deviceName?: string;
}

export interface TwoFactorBackupCodeRequest {
  backupCode: string;
  trustDevice?: boolean;
}

export interface TwoFactorStatus {
  enabled: boolean;
  verified: boolean;
  backupCodesRemaining: number;
  trustedDevices: TrustedDevice[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: string;
  expiresAt: string;
  userAgent: string;
  ipAddress: string;
}

export interface TwoFactorRecoveryRequest {
  recoveryMethod: 'email' | 'sms';
  contact: string;
}

export interface TwoFactorRecoveryVerifyRequest {
  token: string;
  newPassword?: string;
  disable2FA?: boolean;
}

export interface TwoFactorAttempt {
  attempts: number;
  maxAttempts: number;
  lockedUntil?: string;
}