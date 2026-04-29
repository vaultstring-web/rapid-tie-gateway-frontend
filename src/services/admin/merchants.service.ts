import apiClient from '@/lib/api/client';
import { Merchant, MerchantFilter, MerchantResponse, MerchantStats } from '@/types/admin/merchants';

class MerchantsService {
  async getMerchants(page: number = 1, limit: number = 20, filters?: MerchantFilter): Promise<MerchantResponse> {
    const response = await apiClient.get('/admin/merchants', {
      params: { page, limit, ...filters },
    });
    return response.data.data;
  }

  async getMerchant(merchantId: string): Promise<Merchant> {
    const response = await apiClient.get(`/admin/merchants/${merchantId}`);
    return response.data.data;
  }

  async getMerchantStats(): Promise<MerchantStats> {
    const response = await apiClient.get('/admin/merchants/stats');
    return response.data.data;
  }

  async approveMerchant(merchantId: string, notes?: string): Promise<void> {
    await apiClient.post(`/admin/merchants/${merchantId}/approve`, { notes });
  }

  async rejectMerchant(merchantId: string, reason: string): Promise<void> {
    await apiClient.post(`/admin/merchants/${merchantId}/reject`, { reason });
  }

  async suspendMerchant(merchantId: string, reason?: string): Promise<void> {
    await apiClient.post(`/admin/merchants/${merchantId}/suspend`, { reason });
  }

  async activateMerchant(merchantId: string): Promise<void> {
    await apiClient.post(`/admin/merchants/${merchantId}/activate`);
  }

  async deleteMerchant(merchantId: string): Promise<void> {
    await apiClient.delete(`/admin/merchants/${merchantId}`);
  }
}

export const merchantsService = new MerchantsService();