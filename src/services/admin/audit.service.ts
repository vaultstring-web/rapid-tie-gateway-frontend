import apiClient from '@/lib/api/client';
import { AuditLog, AuditFilter, AuditStats } from '@/types/admin/audit';

class AuditService {
  async getAuditLogs(page: number = 1, limit: number = 50, filters?: AuditFilter): Promise<{ logs: AuditLog[]; total: number }> {
    const response = await apiClient.get('/admin/audit', {
      params: { page, limit, ...filters },
    });
    return response.data.data;
  }

  async getAuditStats(): Promise<AuditStats> {
    const response = await apiClient.get('/admin/audit/stats');
    return response.data.data;
  }

  async exportAuditLogs(format: 'csv' | 'json' | 'excel', filters?: AuditFilter): Promise<Blob> {
    const response = await apiClient.post(
      '/admin/audit/export',
      { format, filters },
      { responseType: 'blob' }
    );
    return response.data;
  }

  async verifyIntegrity(): Promise<{ verified: boolean; tamperedLogs: string[] }> {
    const response = await apiClient.get('/admin/audit/verify');
    return response.data.data;
  }
}

export const auditService = new AuditService();