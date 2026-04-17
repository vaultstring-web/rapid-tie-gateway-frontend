import apiClient from '@/lib/api/client';
import { Notification, NotificationsResponse, NotificationType } from '@/types/notifications';

class NotificationService {
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    type?: NotificationType
  ): Promise<NotificationsResponse> {
    const response = await apiClient.get('/notifications', {
      params: { page, limit, type },
    });
    return response.data.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data.data.count;
  }

  async subscribeToNotifications(): Promise<WebSocket> {
    const token = localStorage.getItem('auth_token');
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications?token=${token}`);
    return ws;
  }
}

export const notificationService = new NotificationService();