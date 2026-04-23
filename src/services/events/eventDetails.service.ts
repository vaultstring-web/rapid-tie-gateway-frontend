import apiClient from '@/lib/api/client';
import { EventDetails, TicketTier } from '@/types/events/eventDetails';

class EventDetailsService {
  async getEventDetails(eventId: string): Promise<EventDetails> {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data.data;
  }

  async getSimilarEvents(eventId: string, category: string): Promise<EventDetails[]> {
    const response = await apiClient.get(`/events/${eventId}/similar`, {
      params: { category, limit: 6 },
    });
    return response.data.data;
  }

  async saveEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/save`);
  }

  async unsaveEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/save`);
  }

  async purchaseTicket(eventId: string, tierId: string, quantity: number): Promise<{ orderId: string; total: number }> {
    const response = await apiClient.post(`/events/${eventId}/tickets/purchase`, {
      tierId,
      quantity,
    });
    return response.data.data;
  }
}

export const eventDetailsService = new EventDetailsService();