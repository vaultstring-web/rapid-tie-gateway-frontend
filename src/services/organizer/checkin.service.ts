import apiClient from '@/lib/api/client';
import { CheckinRecord, CheckinStats, OfflineQueueItem } from '@/types/organizer/checkin';

class CheckinService {
  async getStats(eventId: string): Promise<CheckinStats> {
    const response = await apiClient.get(`/organizer/events/${eventId}/checkin/stats`);
    return response.data.data;
  }

  async getRecentCheckins(eventId: string, limit: number = 20): Promise<CheckinRecord[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/checkin/recent`, {
      params: { limit },
    });
    return response.data.data;
  }

  async checkinByQR(eventId: string, qrData: string): Promise<CheckinRecord> {
    const response = await apiClient.post(`/organizer/events/${eventId}/checkin/qr`, { qrData });
    return response.data.data;
  }

  async checkinManual(eventId: string, ticketNumber: string): Promise<CheckinRecord> {
    const response = await apiClient.post(`/organizer/events/${eventId}/checkin/manual`, { ticketNumber });
    return response.data.data;
  }

  async syncOfflineCheckins(eventId: string, checkins: OfflineQueueItem[]): Promise<void> {
    await apiClient.post(`/organizer/events/${eventId}/checkin/sync`, { checkins });
  }
}

export const checkinService = new CheckinService();