import apiClient from '@/lib/api/client';
import { JobQueue, FailedJob, ScheduledJob, JobHistory, JobStats } from '@/types/admin/jobs';

class JobsService {
  async getQueues(): Promise<JobQueue[]> {
    const response = await apiClient.get('/admin/jobs/queues');
    return response.data.data;
  }

  async getFailedJobs(page: number = 1, limit: number = 20): Promise<{ jobs: FailedJob[]; total: number }> {
    const response = await apiClient.get('/admin/jobs/failed', { params: { page, limit } });
    return response.data.data;
  }

  async getFailedJob(jobId: string): Promise<FailedJob> {
    const response = await apiClient.get(`/admin/jobs/failed/${jobId}`);
    return response.data.data;
  }

  async retryJob(jobId: string): Promise<void> {
    await apiClient.post(`/admin/jobs/failed/${jobId}/retry`);
  }

  async retryAllJobs(): Promise<void> {
    await apiClient.post('/admin/jobs/failed/retry-all');
  }

  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/admin/jobs/failed/${jobId}`);
  }

  async deleteAllJobs(): Promise<void> {
    await apiClient.delete('/admin/jobs/failed/all');
  }

  async getScheduledJobs(): Promise<ScheduledJob[]> {
    const response = await apiClient.get('/admin/jobs/scheduled');
    return response.data.data;
  }

  async createScheduledJob(data: Partial<ScheduledJob>): Promise<ScheduledJob> {
    const response = await apiClient.post('/admin/jobs/scheduled', data);
    return response.data.data;
  }

  async updateScheduledJob(jobId: string, data: Partial<ScheduledJob>): Promise<ScheduledJob> {
    const response = await apiClient.put(`/admin/jobs/scheduled/${jobId}`, data);
    return response.data.data;
  }

  async deleteScheduledJob(jobId: string): Promise<void> {
    await apiClient.delete(`/admin/jobs/scheduled/${jobId}`);
  }

  async getJobHistory(queue?: string, page: number = 1, limit: number = 50): Promise<{ jobs: JobHistory[]; total: number }> {
    const response = await apiClient.get('/admin/jobs/history', { params: { queue, page, limit } });
    return response.data.data;
  }

  async getJobStats(): Promise<JobStats> {
    const response = await apiClient.get('/admin/jobs/stats');
    return response.data.data;
  }

  async pauseQueue(queueName: string): Promise<void> {
    await apiClient.post(`/admin/jobs/queues/${queueName}/pause`);
  }

  async resumeQueue(queueName: string): Promise<void> {
    await apiClient.post(`/admin/jobs/queues/${queueName}/resume`);
  }
}

export const jobsService = new JobsService();