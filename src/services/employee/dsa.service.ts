import apiClient from '@/lib/api/client';
import { DsaRequest, DsaRate, MatchingEvent } from '@/types/employee/dsa';

class DsaService {
  async getRates(destination: string, grade: string): Promise<{ perDiem: number; accommodation: number }> {
    const response = await apiClient.get('/employee/dsa/rates', {
      params: { destination, grade },
    });
    return response.data.data;
  }

  async getMatchingEvents(destination: string, startDate: string, endDate: string): Promise<MatchingEvent[]> {
    const response = await apiClient.get('/employee/dsa/events', {
      params: { destination, startDate, endDate },
    });
    return response.data.data;
  }

  async createRequest(data: Partial<DsaRequest>): Promise<DsaRequest> {
    const response = await apiClient.post('/employee/dsa/requests', data);
    return response.data.data;
  }

  async updateRequest(requestId: string, data: Partial<DsaRequest>): Promise<DsaRequest> {
    const response = await apiClient.put(`/employee/dsa/requests/${requestId}`, data);
    return response.data.data;
  }

  async getRequest(requestId: string): Promise<DsaRequest> {
    const response = await apiClient.get(`/employee/dsa/requests/${requestId}`);
    return response.data.data;
  }

  async getEmployeeGrade(): Promise<string> {
    const response = await apiClient.get('/employee/profile/grade');
    return response.data.data.grade;
  }
}

export const dsaService = new DsaService();