import apiClient from '@/lib/api/client';
import { CalendarEvent, CalendarFilters } from '@/types/events/eventCalendar';

class EventCalendarService {
  async getEvents(startDate: Date, endDate: Date, filters?: CalendarFilters): Promise<CalendarEvent[]> {
    const response = await apiClient.post('/calendar/events', {
      startDate,
      endDate,
      filters,
    });
    return response.data.data;
  }

  async getWeather(city: string, date: Date): Promise<any> {
    const response = await apiClient.get('/calendar/weather', {
      params: { city, date: date.toISOString() },
    });
    return response.data.data;
  }

  async exportCalendar(startDate: Date, endDate: Date, format: 'ics' | 'csv'): Promise<Blob> {
    const response = await apiClient.post(
      '/calendar/export',
      { startDate, endDate, format },
      { responseType: 'blob' }
    );
    return response.data;
  }

  async saveEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/save`);
  }

  async unsaveEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/events/${eventId}/save`);
  }
}

export const eventCalendarService = new EventCalendarService();