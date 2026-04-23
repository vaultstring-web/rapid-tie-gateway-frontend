import apiClient from '@/lib/api/client';
import { OrderDetails } from '@/types/orders/orderConfirmation';

class OrderConfirmationService {
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  }

  async resendTickets(orderId: string, method: 'email' | 'sms'): Promise<void> {
    await apiClient.post(`/orders/${orderId}/resend`, { method });
  }

  async downloadTicketsPDF(orderId: string): Promise<Blob> {
    const response = await apiClient.post(
      `/orders/${orderId}/download-pdf`,
      {},
      { responseType: 'blob' }
    );
    return response.data;
  }

  async addToCalendar(orderId: string): Promise<string> {
    const response = await apiClient.get(`/orders/${orderId}/calendar-link`);
    return response.data.data.url;
  }
}

export const orderConfirmationService = new OrderConfirmationService();