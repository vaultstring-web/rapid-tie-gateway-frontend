import apiClient from '@/lib/api/client';
import { TicketTier, TicketTierFormData } from '@/types/organizer/ticketTiers';

class TicketTiersService {
  async getTicketTiers(eventId: string): Promise<TicketTier[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/tiers`);
    return response.data.data;
  }

  async createTicketTier(eventId: string, data: TicketTierFormData): Promise<TicketTier> {
    const response = await apiClient.post(`/organizer/events/${eventId}/tiers`, data);
    return response.data.data;
  }

  async updateTicketTier(eventId: string, tierId: string, data: Partial<TicketTierFormData>): Promise<TicketTier> {
    const response = await apiClient.put(`/organizer/events/${eventId}/tiers/${tierId}`, data);
    return response.data.data;
  }

  async deleteTicketTier(eventId: string, tierId: string): Promise<void> {
    await apiClient.delete(`/organizer/events/${eventId}/tiers/${tierId}`);
  }

  async reorderTicketTiers(eventId: string, tierIds: string[]): Promise<void> {
    await apiClient.post(`/organizer/events/${eventId}/tiers/reorder`, { tierIds });
  }

  async updateTierStatus(eventId: string, tierId: string, isActive: boolean): Promise<void> {
    await apiClient.patch(`/organizer/events/${eventId}/tiers/${tierId}/status`, { isActive });
  }
}

export const ticketTiersService = new TicketTiersService();