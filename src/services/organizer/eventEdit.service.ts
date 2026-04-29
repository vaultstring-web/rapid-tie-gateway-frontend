import apiClient from '@/lib/api/client';
import { EventFormData, AudienceInsight, EventVersion } from '@/types/organizer/eventEdit';

class EventEditService {
  async getEvent(eventId: string): Promise<any> {
    const response = await apiClient.get(`/organizer/events/${eventId}`);
    return response.data.data;
  }

  async updateEvent(eventId: string, data: Partial<EventFormData>): Promise<any> {
    const response = await apiClient.put(`/organizer/events/${eventId}`, data);
    return response.data.data;
  }

  async getAudienceInsights(eventId: string): Promise<AudienceInsight[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/audience-insights`);
    return response.data.data;
  }

  async getEventVersions(eventId: string): Promise<EventVersion[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/versions`);
    return response.data.data;
  }

  async updateStatus(eventId: string, status: 'draft' | 'published' | 'cancelled'): Promise<void> {
    await apiClient.patch(`/organizer/events/${eventId}/status`, { status });
  }

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/organizer/events/${eventId}`);
  }

  async uploadImage(eventId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post(`/organizer/events/${eventId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  async deleteImage(eventId: string, imageId: string): Promise<void> {
    await apiClient.delete(`/organizer/events/${eventId}/images/${imageId}`);
  }
}

export const eventEditService = new EventEditService();