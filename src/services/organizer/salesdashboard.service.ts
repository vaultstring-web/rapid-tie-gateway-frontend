import apiClient from '@/lib/api/client';
import { SalesDashboardData } from '@/types/organizer/salesDashboard';

class SalesDashboardService {
  async getSalesData(eventId: string): Promise<SalesDashboardData> {
    const response = await apiClient.get(`/organizer/events/${eventId}/sales`);
    return response.data.data;
  }

  async getLiveSales(eventId: string): Promise<{ revenue: number; tickets: number; lastSale: string }> {
    const response = await apiClient.get(`/organizer/events/${eventId}/sales/live`);
    return response.data.data;
  }

  async exportSalesReport(eventId: string, format: 'csv' | 'excel'): Promise<Blob> {
    const response = await apiClient.post(
      `/organizer/events/${eventId}/sales/export`,
      { format },
      { responseType: 'blob' }
    );
    return response.data;
  }
}

export const salesDashboardService = new SalesDashboardService();