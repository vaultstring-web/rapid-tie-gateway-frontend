import apiClient from '@/lib/api/client';
import { EmployeeStats, DSARequest, RecentPayment, DestinationEvent } from '@/types/employee/dashboard';

class EmployeeDashboardService {
  async getStats(): Promise<EmployeeStats> {
    const response = await apiClient.get('/employee/dashboard/stats');
    return response.data.data;
  }

  async getPendingRequests(): Promise<DSARequest[]> {
    const response = await apiClient.get('/employee/dsa/requests/pending');
    return response.data.data;
  }

  async getRecentPayments(limit: number = 5): Promise<RecentPayment[]> {
    const response = await apiClient.get('/employee/payments/recent', { params: { limit } });
    return response.data.data;
  }

  async getDestinationEvents(destination: string): Promise<DestinationEvent[]> {
    const response = await apiClient.get('/employee/events/by-destination', { params: { destination } });
    return response.data.data;
  }

  async submitDSARequest(data: Partial<DSARequest>): Promise<DSARequest> {
    const response = await apiClient.post('/employee/dsa/requests', data);
    return response.data.data;
  }
}

export const employeeDashboardService = new EmployeeDashboardService();