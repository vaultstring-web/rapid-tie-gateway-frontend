import apiClient from '@/lib/api/client';
import { Event, EventFilters, EventsResponse } from '@/types/events/eventDiscovery';

class EventDiscoveryService {
  async getEvents(
    page: number = 1,
    limit: number = 20,
    filters?: EventFilters
  ): Promise<EventsResponse> {
    const response = await apiClient.post('/events/discover', {
      page,
      limit,
      filters,
    });
    return response.data.data;
  }

  async getTrendingEvents(limit: number = 6): Promise<Event[]> {
    const response = await apiClient.get('/events/trending', { params: { limit } });
    return response.data.data;
  }

  async saveEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/save`);
  }

  async unsaveEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/save`);
  }

  async getEventDetails(eventId: string): Promise<Event> {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data.data;
  }

  async getCities(): Promise<string[]> {
    const response = await apiClient.get('/events/cities');
    return response.data.data;
  }
}

export const eventDiscoveryService = new EventDiscoveryService();