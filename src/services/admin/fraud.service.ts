import apiClient from '@/lib/api/client';
import { FraudRule, FlaggedTransaction, RuleTestResult, RuleMetrics } from '@/types/admin/fraud';

class FraudService {
  async getRules(): Promise<FraudRule[]> {
    const response = await apiClient.get('/admin/security/fraud/rules');
    return response.data.data;
  }

  async updateRule(ruleId: string, data: Partial<FraudRule>): Promise<FraudRule> {
    const response = await apiClient.put(`/admin/security/fraud/rules/${ruleId}`, data);
    return response.data.data;
  }

  async createRule(data: Partial<FraudRule>): Promise<FraudRule> {
    const response = await apiClient.post('/admin/security/fraud/rules', data);
    return response.data.data;
  }

  async deleteRule(ruleId: string): Promise<void> {
    await apiClient.delete(`/admin/security/fraud/rules/${ruleId}`);
  }

  async reorderRules(ruleIds: string[]): Promise<void> {
    await apiClient.post('/admin/security/fraud/rules/reorder', { ruleIds });
  }

  async getFlaggedTransactions(page: number = 1, limit: number = 20): Promise<{ transactions: FlaggedTransaction[]; total: number }> {
    const response = await apiClient.get('/admin/security/fraud/flagged', { params: { page, limit } });
    return response.data.data;
  }

  async reviewTransaction(transactionId: string, status: 'approved' | 'blocked', notes?: string): Promise<void> {
    await apiClient.post(`/admin/security/fraud/flagged/${transactionId}/review`, { status, notes });
  }

  async testRule(ruleId: string, transactionData: any): Promise<RuleTestResult> {
    const response = await apiClient.post(`/admin/security/fraud/rules/${ruleId}/test`, { transactionData });
    return response.data.data;
  }

  async getRuleMetrics(): Promise<RuleMetrics> {
    const response = await apiClient.get('/admin/security/fraud/metrics');
    return response.data.data;
  }
}

export const fraudService = new FraudService();