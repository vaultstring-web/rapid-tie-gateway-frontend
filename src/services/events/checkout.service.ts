import apiClient from '@/lib/api/client';
import { OrderDetails, BuyerDetails, PaymentResponse } from '@/types/events/checkout';

class CheckoutService {
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    const response = await apiClient.get(`/checkout/order/${orderId}`);
    return response.data.data;
  }

  async processPayment(orderId: string, paymentMethod: string, paymentData: any): Promise<PaymentResponse> {
    const response = await apiClient.post(`/checkout/order/${orderId}/pay`, {
      paymentMethod,
      paymentData,
    });
    return response.data;
  }

  async updateBuyerDetails(orderId: string, buyerDetails: BuyerDetails): Promise<void> {
    await apiClient.put(`/checkout/order/${orderId}/buyer`, buyerDetails);
  }

  async applyPromoCode(orderId: string, code: string): Promise<OrderDetails> {
    const response = await apiClient.post(`/checkout/order/${orderId}/promo`, { code });
    return response.data.data;
  }

  async removePromoCode(orderId: string): Promise<OrderDetails> {
    const response = await apiClient.delete(`/checkout/order/${orderId}/promo`);
    return response.data.data;
  }
}

export const checkoutService = new CheckoutService();