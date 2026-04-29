import apiClient from '@/lib/api/client';
import { AdminDashboardData } from '@/types/admin';

class AdminService {
  async getDashboardData(): Promise<AdminDashboardData> {
    const response = await apiClient.get('/admin/dashboard');
    return response.data.data;
  }

  async getSystemStatus(): Promise<any> {
    const response = await apiClient.get('/admin/system/status');
    return response.data.data;
  }

  async resolveError(errorId: string): Promise<void> {
    await apiClient.patch(`/admin/errors/${errorId}/resolve`);
  }
}

export const adminService = new AdminService();