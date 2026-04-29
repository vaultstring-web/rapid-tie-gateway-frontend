import apiClient from '@/lib/api/client';
import { Payment, PaymentFilter, PaymentStats } from '@/types/employee/payments';

class PaymentsService {
  async getPayments(page: number = 1, limit: number = 20, filters?: PaymentFilter): Promise<{ payments: Payment[]; total: number }> {
    const response = await apiClient.get('/employee/payments', {
      params: { page, limit, ...filters },
    });
    return response.data.data;
  }

  async getPaymentDetails(paymentId: string): Promise<Payment> {
    const response = await apiClient.get(`/employee/payments/${paymentId}`);
    return response.data.data;
  }

  async getPaymentStats(): Promise<PaymentStats> {
    const response = await apiClient.get('/employee/payments/stats');
    return response.data.data;
  }

  async downloadReceipt(paymentId: string): Promise<Blob> {
    const response = await apiClient.get(`/employee/payments/${paymentId}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportPayments(format: 'csv' | 'pdf', filters?: PaymentFilter): Promise<Blob> {
    const response = await apiClient.post(
      '/employee/payments/export',
      { format, filters },
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export const paymentsService = new PaymentsService();