import apiClient from '@/lib/api/client';
import { CreateEventFormData } from '@/types/organizer/createEvent';

class CreateEventService {
  async createEvent(data: CreateEventFormData): Promise<{ eventId: string }> {
    const formData = new FormData();
    
    // Append all fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'ticketTiers') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'coverImage' && value instanceof File) {
        formData.append('coverImage', value);
      } else if (key === 'galleryImages' && Array.isArray(value)) {
        value.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`galleryImages[${index}]`, file);
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await apiClient.post('/organizer/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/upload', formData);
    return response.data.data;
  }
}

export const createEventService = new CreateEventService();