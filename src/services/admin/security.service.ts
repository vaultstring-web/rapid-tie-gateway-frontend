import apiClient from '@/lib/api/client';
import { SecurityMetrics, FailedLoginData, SuspiciousIP, SecurityScanResult, SecurityScanSummary } from '@/types/admin/security';

class SecurityService {
  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const response = await apiClient.get('/admin/security/metrics');
    return response.data.data;
  }

  async getFailedLoginsData(): Promise<FailedLoginData[]> {
    const response = await apiClient.get('/admin/security/failed-logins');
    return response.data.data;
  }

  async getSuspiciousIPs(): Promise<SuspiciousIP[]> {
    const response = await apiClient.get('/admin/security/suspicious-ips');
    return response.data.data;
  }

  async blockIP(ip: string, reason: string): Promise<void> {
    await apiClient.post('/admin/security/ips/block', { ip, reason });
  }

  async whitelistIP(ip: string): Promise<void> {
    await apiClient.post('/admin/security/ips/whitelist', { ip });
  }

  async unblockIP(ip: string): Promise<void> {
    await apiClient.delete(`/admin/security/ips/${ip}/block`);
  }

  async getSecurityScans(): Promise<SecurityScanResult[]> {
    const response = await apiClient.get('/admin/security/scans');
    return response.data.data;
  }

  async runSecurityScan(): Promise<SecurityScanResult[]> {
    const response = await apiClient.post('/admin/security/scans/run');
    return response.data.data;
  }
}

export const securityService = new SecurityService();