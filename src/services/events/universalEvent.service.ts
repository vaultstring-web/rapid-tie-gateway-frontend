import apiClient from '@/lib/api/client';
import { UniversalEvent, EventFilter, EventsResponse, EventTab } from '@/types/events/universalEvent';

class UniversalEventService {
  async getEvents(
    tab: EventTab,
    page: number = 1,
    limit: number = 20,
    filters?: EventFilter
  ): Promise<EventsResponse> {
    const response = await apiClient.post('/events/universal', {
      tab,
      page,
      limit,
      filters,
    });
    return response.data.data;
  }

  async getTrendingEvents(role?: string): Promise<UniversalEvent[]> {
    const response = await apiClient.get('/events/trending', { params: { role } });
    return response.data.data;
  }

  async saveEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/save`);
  }

  async unsaveEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/save`);
  }

  async getSavedEvents(): Promise<string[]> {
    const response = await apiClient.get('/events/saved');
    return response.data.data;
  }

  async getEventDetails(eventId: string): Promise<UniversalEvent> {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data.data;
  }
}

export const universalEventService = new UniversalEventService();