import apiClient from '@/lib/api/client';
import {
  TwoFactorSetup,
  TwoFactorVerifyRequest,
  TwoFactorBackupCodeRequest,
  TwoFactorStatus,
  TwoFactorAttempt,
  TrustedDevice
} from '@/types/2fa';
import toast from 'react-hot-toast';

class TwoFactorService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Get 2FA status
  async getStatus(): Promise<TwoFactorStatus> {
    try {
      const response = await apiClient.get('/auth/2fa/status');
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get 2FA status:', error);
      throw error;
    }
  }

  // Setup 2FA (generate secret and QR code)
  async setup(): Promise<TwoFactorSetup> {
    try {
      const response = await apiClient.post('/auth/2fa/setup');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to setup 2FA';
      toast.error(message);
      throw error;
    }
  }

  // Verify and enable 2FA
  async enable(code: string, trustDevice: boolean = false): Promise<{ backupCodes: string[] }> {
    try {
      const response = await apiClient.post('/auth/2fa/enable', {
        code,
        trustDevice
      });
      toast.success('2FA enabled successfully!');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid verification code';
      toast.error(message);
      throw error;
    }
  }

  // Disable 2FA
  async disable(password: string): Promise<void> {
    try {
      await apiClient.post('/auth/2fa/disable', { password });
      toast.success('2FA disabled successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to disable 2FA';
      toast.error(message);
      throw error;
    }
  }

  // Verify 2FA during login
  async verify(credentials: TwoFactorVerifyRequest): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await apiClient.post('/auth/2fa/verify', credentials);
      return response.data.data;
    } catch (error: any) {
      const remaining = error.response?.data?.remainingAttempts;
      if (remaining !== undefined) {
        throw { remaining, message: error.response?.data?.message };
      }
      throw error;
    }
  }

  // Verify using backup code
  async verifyWithBackupCode(credentials: TwoFactorBackupCodeRequest): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await apiClient.post('/auth/2fa/backup-code', credentials);
      toast.success('Backup code verified successfully');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid backup code';
      toast.error(message);
      throw error;
    }
  }

  // Get trusted devices
  async getTrustedDevices(): Promise<TrustedDevice[]> {
    try {
      const response = await apiClient.get('/auth/2fa/devices');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get trusted devices:', error);
      return [];
    }
  }

  // Revoke trusted device
  async revokeDevice(deviceId: string): Promise<void> {
    try {
      await apiClient.delete(`/auth/2fa/devices/${deviceId}`);
      toast.success('Device removed from trusted list');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to revoke device';
      toast.error(message);
      throw error;
    }
  }

  // Generate new backup codes
  async regenerateBackupCodes(): Promise<string[]> {
    try {
      const response = await apiClient.post('/auth/2fa/backup-codes/regenerate');
      toast.success('New backup codes generated');
      return response.data.data.codes;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate backup codes';
      toast.error(message);
      throw error;
    }
  }

  // Request recovery (email/SMS)
  async requestRecovery(method: 'email' | 'sms', contact: string): Promise<void> {
    try {
      await apiClient.post('/auth/2fa/recovery/request', { method, contact });
      toast.success(`Recovery code sent to your ${method}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send recovery code';
      toast.error(message);
      throw error;
    }
  }

  // Verify recovery and reset
  async verifyRecovery(token: string, newPassword?: string, disable2FA: boolean = true): Promise<void> {
    try {
      await apiClient.post('/auth/2fa/recovery/verify', { token, newPassword, disable2FA });
      toast.success('2FA recovery successful');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid recovery code';
      toast.error(message);
      throw error;
    }
  }

  // Get attempt status (for UI)
  getAttemptStatus(attempts: number, lockedUntil?: string): TwoFactorAttempt {
    const now = Date.now();
    const lockoutExpiry = lockedUntil ? new Date(lockedUntil).getTime() : null;

    return {
      attempts,
      maxAttempts: this.MAX_ATTEMPTS,
      lockedUntil: lockoutExpiry && lockoutExpiry > now ? lockedUntil : undefined,
    };
  }

  // Check if account is locked
  isLocked(lockedUntil?: string): boolean {
    if (!lockedUntil) return false;
    return new Date(lockedUntil).getTime() > Date.now();
  }

  // Get remaining time until lockout expires
  getLockoutRemainingTime(lockedUntil?: string): number | null {
    if (!lockedUntil) return null;
    const remaining = new Date(lockedUntil).getTime() - Date.now();
    return remaining > 0 ? remaining : null;
  }
}

export const twoFactorService = new TwoFactorService();