import apiClient from '@/lib/api/client';
import { RecommendationResponse, RecommendedEvent, RecommendationCategory } from '@/types/events/eventRecommendation';

class EventRecommendationService {
  async getRecommendations(): Promise<RecommendationResponse> {
    const response = await apiClient.get('/events/recommendations');
    return response.data.data;
  }

  async markNotInterested(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/not-interested`);
  }

  async markInterested(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/not-interested`);
  }

  async saveEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/save`);
  }

  async unsaveEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/save`);
  }

  async getFeedback(): Promise<any> {
    const response = await apiClient.get('/events/recommendations/feedback');
    return response.data.data;
  }
}

export const eventRecommendationService = new EventRecommendationService();