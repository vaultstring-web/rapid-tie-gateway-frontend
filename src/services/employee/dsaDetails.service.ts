import apiClient from '@/lib/api/client';
import { DsaRequestDetail, ApprovalStep, Comment, LocalEvent } from '@/types/employee/dsaDetails';

class DsaDetailsService {
  async getRequestDetails(requestId: string): Promise<DsaRequestDetail> {
    const response = await apiClient.get(`/employee/dsa/requests/${requestId}`);
    return response.data.data;
  }

  async getApprovalTimeline(requestId: string): Promise<ApprovalStep[]> {
    const response = await apiClient.get(`/employee/dsa/requests/${requestId}/approvals`);
    return response.data.data;
  }

  async getComments(requestId: string): Promise<Comment[]> {
    const response = await apiClient.get(`/employee/dsa/requests/${requestId}/comments`);
    return response.data.data;
  }

  async addComment(requestId: string, content: string): Promise<Comment> {
    const response = await apiClient.post(`/employee/dsa/requests/${requestId}/comments`, { content });
    return response.data.data;
  }

  async cancelRequest(requestId: string): Promise<void> {
    await apiClient.post(`/employee/dsa/requests/${requestId}/cancel`);
  }

  async getLocalEvents(destination: string, startDate: string, endDate: string): Promise<LocalEvent[]> {
    const response = await apiClient.get('/employee/dsa/events/local', {
      params: { destination, startDate, endDate },
    });
    return response.data.data;
  }
}

export const dsaDetailsService = new DsaDetailsService();