import apiClient from '@/lib/api/client';
import { SystemHealthData } from '@/types/admin/health';

class HealthService {
  async getHealthData(): Promise<SystemHealthData> {
    const response = await apiClient.get('/admin/health');
    return response.data.data;
  }

  async getDatabaseMetrics(): Promise<any> {
    const response = await apiClient.get('/admin/health/database');
    return response.data.data;
  }

  async getRedisMetrics(): Promise<any> {
    const response = await apiClient.get('/admin/health/redis');
    return response.data.data;
  }

  async getWorkerMetrics(): Promise<any> {
    const response = await apiClient.get('/admin/health/workers');
    return response.data.data;
  }

  async getStorageMetrics(): Promise<any> {
    const response = await apiClient.get('/admin/health/storage');
    return response.data.data;
  }
}

export const healthService = new HealthService();