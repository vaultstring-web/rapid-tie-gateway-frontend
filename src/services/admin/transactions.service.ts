import apiClient from '@/lib/api/client';
import { Transaction, TransactionFilter, TransactionStats } from '@/types/admin/transactions';

class TransactionsService {
  async getTransactions(page: number = 1, limit: number = 50, filters?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await apiClient.get('/admin/monitor/transactions', {
      params: { page, limit, ...filters },
    });
    return response.data.data;
  }

  async getTransactionStats(): Promise<TransactionStats> {
    const response = await apiClient.get('/admin/monitor/transactions/stats');
    return response.data.data;
  }

  async holdTransaction(transactionId: string, reason: string): Promise<void> {
    await apiClient.post(`/admin/monitor/transactions/${transactionId}/hold`, { reason });
  }

  async approveTransaction(transactionId: string, notes?: string): Promise<void> {
    await apiClient.post(`/admin/monitor/transactions/${transactionId}/approve`, { notes });
  }

  async releaseTransaction(transactionId: string): Promise<void> {
    await apiClient.post(`/admin/monitor/transactions/${transactionId}/release`);
  }

  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    const response = await apiClient.get(`/admin/monitor/transactions/${transactionId}`);
    return response.data.data;
  }
}

export const transactionsService = new TransactionsService();