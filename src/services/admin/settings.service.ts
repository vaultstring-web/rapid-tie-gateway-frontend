import apiClient from '@/lib/api/client';
import { SystemSettings, SecuritySettings, EmailSettings, NotificationSettings, ApiSettings, MaintenanceSettings, BackupSettings } from '@/types/admin/settings';

class AdminSettingsService {
  async getSystemSettings(): Promise<SystemSettings> {
    const response = await apiClient.get('/admin/settings/system');
    return response.data.data;
  }

  async updateSystemSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await apiClient.put('/admin/settings/system', data);
    return response.data.data;
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await apiClient.get('/admin/settings/security');
    return response.data.data;
  }

  async updateSecuritySettings(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await apiClient.put('/admin/settings/security', data);
    return response.data.data;
  }

  async getEmailSettings(): Promise<EmailSettings> {
    const response = await apiClient.get('/admin/settings/email');
    return response.data.data;
  }

  async updateEmailSettings(data: Partial<EmailSettings>): Promise<EmailSettings> {
    const response = await apiClient.put('/admin/settings/email', data);
    return response.data.data;
  }

  async testEmailConnection(settings: EmailSettings): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/admin/settings/email/test', settings);
    return response.data.data;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get('/admin/settings/notifications');
    return response.data.data;
  }

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await apiClient.put('/admin/settings/notifications', data);
    return response.data.data;
  }

  async getApiSettings(): Promise<ApiSettings> {
    const response = await apiClient.get('/admin/settings/api');
    return response.data.data;
  }

  async updateApiSettings(data: Partial<ApiSettings>): Promise<ApiSettings> {
    const response = await apiClient.put('/admin/settings/api', data);
    return response.data.data;
  }

  async regenerateApiKey(keyId: string): Promise<{ key: string }> {
    const response = await apiClient.post(`/admin/settings/api/keys/${keyId}/regenerate`);
    return response.data.data;
  }

  async revokeApiKey(keyId: string): Promise<void> {
    await apiClient.delete(`/admin/settings/api/keys/${keyId}`);
  }

  async getMaintenanceSettings(): Promise<MaintenanceSettings> {
    const response = await apiClient.get('/admin/settings/maintenance');
    return response.data.data;
  }

  async updateMaintenanceSettings(data: Partial<MaintenanceSettings>): Promise<MaintenanceSettings> {
    const response = await apiClient.put('/admin/settings/maintenance', data);
    return response.data.data;
  }

  async getBackupSettings(): Promise<BackupSettings> {
    const response = await apiClient.get('/admin/settings/backup');
    return response.data.data;
  }

  async updateBackupSettings(data: Partial<BackupSettings>): Promise<BackupSettings> {
    const response = await apiClient.put('/admin/settings/backup', data);
    return response.data.data;
  }

  async runBackup(): Promise<{ success: boolean; location: string }> {
    const response = await apiClient.post('/admin/settings/backup/run');
    return response.data.data;
  }

  async clearCache(): Promise<void> {
    await apiClient.post('/admin/settings/cache/clear');
  }
}

export const adminSettingsService = new AdminSettingsService();