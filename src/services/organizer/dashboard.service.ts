import apiClient from '@/lib/api/client';
import { OrganizerEvent, DashboardStats, NearbyEvent } from '@/types/organizer/dashboard';

class OrganizerDashboardService {
  async getEvents(): Promise<OrganizerEvent[]> {
    const response = await apiClient.get('/organizer/events');
    return response.data.data;
  }

  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/organizer/stats');
    return response.data.data;
  }

  async getNearbyEvents(latitude: number, longitude: number): Promise<NearbyEvent[]> {
    const response = await apiClient.get('/organizer/nearby-events', {
      params: { latitude, longitude },
    });
    return response.data.data;
  }

  async createEvent(eventData: Partial<OrganizerEvent>): Promise<OrganizerEvent> {
    const response = await apiClient.post('/organizer/events', eventData);
    return response.data.data;
  }

  async updateEvent(eventId: string, eventData: Partial<OrganizerEvent>): Promise<OrganizerEvent> {
    const response = await apiClient.put(`/organizer/events/${eventId}`, eventData);
    return response.data.data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/organizer/events/${eventId}`);
  }

  async publishEvent(eventId: string): Promise<void> {
    await apiClient.post(`/organizer/events/${eventId}/publish`);
  }
}

export const organizerDashboardService = new OrganizerDashboardService();