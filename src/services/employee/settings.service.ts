import apiClient from '@/lib/api/client';
import { EmployeeProfile, NotificationPreferences, SecuritySettings, ChangePasswordRequest } from '@/types/employee/settings';

class EmployeeSettingsService {
  async getProfile(): Promise<EmployeeProfile> {
    const response = await apiClient.get('/employee/profile');
    return response.data.data;
  }

  async updateProfile(data: Partial<EmployeeProfile>): Promise<EmployeeProfile> {
    const response = await apiClient.put('/employee/profile', data);
    return response.data.data;
  }

  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/employee/profile/avatar', formData);
    return response.data.data;
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get('/employee/notifications');
    return response.data.data;
  }

  async updateNotificationPreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.put('/employee/notifications', data);
    return response.data.data;
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await apiClient.get('/employee/security');
    return response.data.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/employee/security/password', data);
  }

  async enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
    const response = await apiClient.post('/employee/security/2fa/enable');
    return response.data.data;
  }

  async disableTwoFactor(code: string): Promise<void> {
    await apiClient.post('/employee/security/2fa/disable', { code });
  }

  async terminateSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/employee/security/sessions/${sessionId}`);
  }
}

export const employeeSettingsService = new EmployeeSettingsService();