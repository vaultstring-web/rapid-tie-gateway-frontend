import apiClient from '@/lib/api/client';
import { TicketTier, PurchaseFormData, OrderSummary, RoleBasedPrice } from '@/types/events/ticketPurchase';

class TicketPurchaseService {
  async getTicketTiers(eventId: string): Promise<TicketTier[]> {
    const response = await apiClient.get(`/events/${eventId}/tickets/tiers`);
    return response.data.data;
  }

  async getRoleBasedPrices(eventId: string): Promise<RoleBasedPrice[]> {
    const response = await apiClient.get(`/events/${eventId}/tickets/role-prices`);
    return response.data.data;
  }

  async calculateOrder(eventId: string, tierId: string, quantity: number, promoCode?: string): Promise<OrderSummary> {
    const response = await apiClient.post(`/events/${eventId}/tickets/calculate`, {
      tierId,
      quantity,
      promoCode,
    });
    return response.data.data;
  }

  async purchaseTickets(eventId: string, data: PurchaseFormData): Promise<{ orderId: string; paymentUrl?: string }> {
    const response = await apiClient.post(`/events/${eventId}/tickets/purchase`, data);
    return response.data.data;
  }

  async validatePromoCode(eventId: string, code: string): Promise<{ valid: boolean; discount: number; message?: string }> {
    const response = await apiClient.get(`/events/${eventId}/promo/${code}`);
    return response.data.data;
  }
}

export const ticketPurchaseService = new TicketPurchaseService();