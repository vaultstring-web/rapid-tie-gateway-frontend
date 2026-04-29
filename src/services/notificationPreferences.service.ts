import apiClient from '@/lib/api/client';
import { NotificationPreferencesState, EmailFrequency, QuietHours, NotificationCategory } from '@/types/notificationPreferences';

class NotificationPreferencesService {
  async getPreferences(): Promise<NotificationPreferencesState> {
    const response = await apiClient.get('/user/notifications/preferences');
    return response.data.data;
  }

  async updatePreferences(preferences: Record<NotificationCategory, boolean>): Promise<void> {
    await apiClient.put('/user/notifications/preferences', { preferences });
  }

  async updateEmailFrequency(frequency: EmailFrequency): Promise<void> {
    await apiClient.put('/user/notifications/email-frequency', { frequency });
  }

  async updateQuietHours(quietHours: QuietHours): Promise<void> {
    await apiClient.put('/user/notifications/quiet-hours', quietHours);
  }

  async testNotification(channel: 'email' | 'sms' | 'push'): Promise<void> {
    await apiClient.post('/user/notifications/test', { channel });
  }

  async updateChannelPreference(
    category: NotificationCategory, 
    channel: 'email' | 'sms' | 'push' | 'in_app', 
    enabled: boolean
  ): Promise<void> {
    await apiClient.put(`/user/notifications/channels/${category}`, { channel, enabled });
  }
}

export const notificationPreferencesService = new NotificationPreferencesService();