import apiClient from '@/lib/api/client';
import { OrganizerProfile, NotificationSettings, SecuritySettings, BillingInfo, ApiKey, TeamMember } from '@/types/organizer/settings';

class OrganizerSettingsService {
  // Profile
  async getProfile(): Promise<OrganizerProfile> {
    const response = await apiClient.get('/organizer/profile');
    return response.data.data;
  }

  async updateProfile(data: Partial<OrganizerProfile>): Promise<OrganizerProfile> {
    const response = await apiClient.put('/organizer/profile', data);
    return response.data.data;
  }

  async uploadLogo(file: File): Promise<{ logo: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await apiClient.post('/organizer/profile/logo', formData);
    return response.data.data;
  }

  // Notifications
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get('/organizer/notifications');
    return response.data.data;
  }

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await apiClient.put('/organizer/notifications', data);
    return response.data.data;
  }

  // Security
  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await apiClient.get('/organizer/security');
    return response.data.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/organizer/security/password', { currentPassword, newPassword });
  }

  async enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
    const response = await apiClient.post('/organizer/security/2fa/enable');
    return response.data.data;
  }

  async disableTwoFactor(code: string): Promise<void> {
    await apiClient.post('/organizer/security/2fa/disable', { code });
  }

  async terminateSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/organizer/security/sessions/${sessionId}`);
  }

  // Billing
  async getBillingInfo(): Promise<BillingInfo> {
    const response = await apiClient.get('/organizer/billing');
    return response.data.data;
  }

  async updatePaymentMethod(paymentMethodId: string): Promise<void> {
    await apiClient.post('/organizer/billing/payment-method', { paymentMethodId });
  }

  async cancelSubscription(): Promise<void> {
    await apiClient.post('/organizer/billing/cancel');
  }

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get('/organizer/api-keys');
    return response.data.data;
  }

  async createApiKey(name: string, permissions: ('read' | 'write' | 'admin')[]): Promise<ApiKey> {
    const response = await apiClient.post('/organizer/api-keys', { name, permissions });
    return response.data.data;
  }

  async deleteApiKey(keyId: string): Promise<void> {
    await apiClient.delete(`/organizer/api-keys/${keyId}`);
  }

  // Team
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await apiClient.get('/organizer/team');
    return response.data.data;
  }

  async inviteTeamMember(email: string, role: 'admin' | 'manager' | 'viewer'): Promise<TeamMember> {
    const response = await apiClient.post('/organizer/team/invite', { email, role });
    return response.data.data;
  }

  async updateTeamMemberRole(memberId: string, role: 'admin' | 'manager' | 'viewer'): Promise<void> {
    await apiClient.put(`/organizer/team/${memberId}`, { role });
  }

  async removeTeamMember(memberId: string): Promise<void> {
    await apiClient.delete(`/organizer/team/${memberId}`);
  }
}

export const organizerSettingsService = new OrganizerSettingsService();