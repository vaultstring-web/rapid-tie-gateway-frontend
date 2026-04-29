import apiClient from '@/lib/api/client';
import { AdminEvent, EventFilter, EventStats } from '@/types/admin/events';

class AdminEventsService {
  async getEvents(page: number = 1, limit: number = 20, filters?: EventFilter): Promise<{ events: AdminEvent[]; total: number }> {
    const response = await apiClient.get('/admin/events', {
      params: { page, limit, ...filters },
    });
    return response.data.data;
  }

  async getEvent(eventId: string): Promise<AdminEvent> {
    const response = await apiClient.get(`/admin/events/${eventId}`);
    return response.data.data;
  }

  async getEventStats(): Promise<EventStats> {
    const response = await apiClient.get('/admin/events/stats');
    return response.data.data;
  }

  async approveEvent(eventId: string, notes?: string): Promise<void> {
    await apiClient.post(`/admin/events/${eventId}/approve`, { notes });
  }

  async rejectEvent(eventId: string, reason: string): Promise<void> {
    await apiClient.post(`/admin/events/${eventId}/reject`, { reason });
  }

  async publishEvent(eventId: string): Promise<void> {
    await apiClient.post(`/admin/events/${eventId}/publish`);
  }

  async cancelEvent(eventId: string, reason: string): Promise<void> {
    await apiClient.post(`/admin/events/${eventId}/cancel`, { reason });
  }

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/admin/events/${eventId}`);
  }

  async featureEvent(eventId: string, featured: boolean): Promise<void> {
    await apiClient.post(`/admin/events/${eventId}/feature`, { featured });
  }
}

export const adminEventsService = new AdminEventsService();