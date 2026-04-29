import apiClient from '@/lib/api/client';
import { DashboardData } from '@/types/rejected.ts/dashboard';

class ApproverDashboardService {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiClient.get('/approver/dashboard');
    return response.data.data;
  }

  async getPendingRequests(): Promise<any[]> {
    const response = await apiClient.get('/approver/pending');
    return response.data.data;
  }

  async getTeamSummary(): Promise<any[]> {
    const response = await apiClient.get('/approver/team');
    return response.data.data;
  }

  async getRecentDecisions(limit: number = 10): Promise<any[]> {
    const response = await apiClient.get('/approver/decisions/recent', {
      params: { limit },
    });
    return response.data.data;
  }

  async getApprovalStats(): Promise<any> {
    const response = await apiClient.get('/approver/stats');
    return response.data.data;
  }
}

export const approverDashboardService = new ApproverDashboardService();
