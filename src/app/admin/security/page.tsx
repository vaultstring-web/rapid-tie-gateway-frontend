'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { SecurityMetricsCards } from '@/components/admin/security/SecurityMetricsCards';
import { FailedLoginsChart } from '@/components/admin/security/FailedLoginsChart';
import { SuspiciousIPsList } from '@/components/admin/security/SuspiciousIPsList';
import { TwoFactorAdoption } from '@/components/admin/security/TwoFactorAdoption';
import { SecurityScanResults } from '@/components/admin/security/SecurityScanResults';
import { securityService } from '@/services/admin/security.service';
import { SecurityMetrics, FailedLoginData, SuspiciousIP, SecurityScanResult, SecurityScanSummary } from '@/types/admin/security';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockMetrics = (): SecurityMetrics => {
  return {
    totalFailedLogins: 1245,
    failedLoginsChange: 8.5,
    activeSessions: 3420,
    activeSessionsChange: 12.3,
    blockedIPs: 23,
    blockedIPsChange: 5,
    twoFactorEnabled: 2890,
    totalUsers: 5000,
    twoFactorAdoptionRate: 57.8,
    securityScore: 86,
    securityScoreChange: 2.5,
  };
};

const getMockFailedLoginsData = (): FailedLoginData[] => {
  return [
    { hour: '00:00', count: 12, uniqueIPs: 5 },
    { hour: '01:00', count: 8, uniqueIPs: 3 },
    { hour: '02:00', count: 15, uniqueIPs: 7 },
    { hour: '03:00', count: 25, uniqueIPs: 10 },
    { hour: '04:00', count: 18, uniqueIPs: 8 },
    { hour: '05:00', count: 10, uniqueIPs: 4 },
    { hour: '06:00', count: 22, uniqueIPs: 9 },
    { hour: '07:00', count: 35, uniqueIPs: 15 },
    { hour: '08:00', count: 52, uniqueIPs: 22 },
    { hour: '09:00', count: 48, uniqueIPs: 20 },
    { hour: '10:00', count: 55, uniqueIPs: 25 },
    { hour: '11:00', count: 42, uniqueIPs: 18 },
    { hour: '12:00', count: 38, uniqueIPs: 16 },
    { hour: '13:00', count: 45, uniqueIPs: 19 },
    { hour: '14:00', count: 50, uniqueIPs: 21 },
    { hour: '15:00', count: 48, uniqueIPs: 20 },
    { hour: '16:00', count: 42, uniqueIPs: 17 },
    { hour: '17:00', count: 35, uniqueIPs: 14 },
    { hour: '18:00', count: 28, uniqueIPs: 11 },
    { hour: '19:00', count: 20, uniqueIPs: 8 },
    { hour: '20:00', count: 15, uniqueIPs: 6 },
    { hour: '21:00', count: 10, uniqueIPs: 4 },
    { hour: '22:00', count: 8, uniqueIPs: 3 },
    { hour: '23:00', count: 6, uniqueIPs: 2 },
  ];
};

const getMockSuspiciousIPs = (): SuspiciousIP[] => {
  return [
    {
      ip: '192.168.1.100',
      location: 'Lilongwe, Malawi',
      failedAttempts: 45,
      lastAttempt: new Date().toISOString(),
      status: 'active',
      riskScore: 85,
      attemptsByHour: { '09:00': 12, '10:00': 18, '11:00': 15 },
    },
    {
      ip: '10.0.0.45',
      location: 'Blantyre, Malawi',
      failedAttempts: 28,
      lastAttempt: new Date(Date.now() - 3600000).toISOString(),
      status: 'blocked',
      riskScore: 72,
      attemptsByHour: { '14:00': 10, '15:00': 18 },
    },
    {
      ip: '172.16.0.200',
      location: 'Mzuzu, Malawi',
      failedAttempts: 12,
      lastAttempt: new Date(Date.now() - 7200000).toISOString(),
      status: 'active',
      riskScore: 45,
      attemptsByHour: { '08:00': 5, '09:00': 7 },
    },
  ];
};

const getMockSecurityScans = (): SecurityScanResult[] => {
  return [
    {
      id: 'scan-1',
      name: 'SSL/TLS Configuration',
      status: 'passed',
      score: 100,
      lastRun: new Date().toISOString(),
      details: 'All SSL/TLS configurations are secure and up to date.',
      recommendations: [],
    },
    {
      id: 'scan-2',
      name: 'Database Security',
      status: 'warning',
      score: 75,
      lastRun: new Date().toISOString(),
      details: 'Database encryption is enabled but some tables are not encrypted.',
      recommendations: ['Encrypt user_data table', 'Enable audit logging for all tables'],
    },
    {
      id: 'scan-3',
      name: 'API Security',
      status: 'failed',
      score: 55,
      lastRun: new Date().toISOString(),
      details: 'API rate limiting is not properly configured on some endpoints.',
      recommendations: ['Implement rate limiting on all endpoints', 'Add API key rotation policy'],
    },
    {
      id: 'scan-4',
      name: 'Authentication Security',
      status: 'passed',
      score: 92,
      lastRun: new Date().toISOString(),
      details: 'Password policies and 2FA implementation are secure.',
      recommendations: ['Consider implementing biometric authentication'],
    },
  ];
};

const getMockScanSummary = (): SecurityScanSummary => {
  const scans = getMockSecurityScans();
  return {
    total: scans.length,
    passed: scans.filter(s => s.status === 'passed').length,
    warning: scans.filter(s => s.status === 'warning').length,
    failed: scans.filter(s => s.status === 'failed').length,
    overallScore: 80,
  };
};

export default function SecurityDashboardPage() {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [failedLoginsData, setFailedLoginsData] = useState<FailedLoginData[]>([]);
  const [suspiciousIPs, setSuspiciousIPs] = useState<SuspiciousIP[]>([]);
  const [securityScans, setSecurityScans] = useState<SecurityScanResult[]>([]);
  const [scanSummary, setScanSummary] = useState<SecurityScanSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockMetrics = getMockMetrics();
      const mockFailedLogins = getMockFailedLoginsData();
      const mockIPs = getMockSuspiciousIPs();
      const mockScans = getMockSecurityScans();
      const mockScanSummary = getMockScanSummary();
      
      setMetrics(mockMetrics);
      setFailedLoginsData(mockFailedLogins);
      setSuspiciousIPs(mockIPs);
      setSecurityScans(mockScans);
      setScanSummary(mockScanSummary);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ip: string, reason: string) => {
    if (useMockData) {
      setSuspiciousIPs(prev => prev.map(ipObj =>
        ipObj.ip === ip ? { ...ipObj, status: 'blocked' } : ipObj
      ));
      toast.success(`IP ${ip} blocked (demo)`);
      return;
    }
    try {
      await securityService.blockIP(ip, reason);
      toast.success(`IP ${ip} blocked`);
      loadData();
    } catch (error) {
      toast.error('Failed to block IP');
    }
  };

  const handleWhitelistIP = async (ip: string) => {
    if (useMockData) {
      setSuspiciousIPs(prev => prev.map(ipObj =>
        ipObj.ip === ip ? { ...ipObj, status: 'whitelisted' } : ipObj
      ));
      toast.success(`IP ${ip} whitelisted (demo)`);
      return;
    }
    try {
      await securityService.whitelistIP(ip);
      toast.success(`IP ${ip} whitelisted`);
      loadData();
    } catch (error) {
      toast.error('Failed to whitelist IP');
    }
  };

  const handleUnblockIP = async (ip: string) => {
    if (useMockData) {
      setSuspiciousIPs(prev => prev.map(ipObj =>
        ipObj.ip === ip ? { ...ipObj, status: 'active' } : ipObj
      ));
      toast.success(`IP ${ip} unblocked (demo)`);
      return;
    }
    try {
      await securityService.unblockIP(ip);
      toast.success(`IP ${ip} unblocked`);
      loadData();
    } catch (error) {
      toast.error('Failed to unblock IP');
    }
  };

  const handleRunScan = async () => {
    if (useMockData) {
      toast.info('Running security scan (demo)...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Security scan completed (demo)');
      loadData();
      return;
    }
    await securityService.runSecurityScan();
    toast.success('Security scan completed');
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor security metrics and manage threats
          </p>
        </div>
        <button
          onClick={() => { loadData(); toast.success('Data refreshed'); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample security data. Connect to backend for live monitoring.
          </p>
        </div>
      )}

      {/* Security Metrics Cards */}
      {metrics && <SecurityMetricsCards metrics={metrics} loading={loading} />}

      {/* Failed Logins Chart */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-5">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Failed Login Attempts (Last 24 Hours)</h2>
        <FailedLoginsChart data={failedLoginsData} loading={loading} />
      </div>

      {/* Suspicious IPs and 2FA Adoption Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <div className="px-5 py-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Suspicious IP Addresses</h2>
            </div>
            <div className="p-5">
              <SuspiciousIPsList
                ips={suspiciousIPs}
                loading={loading}
                onBlock={handleBlockIP}
                onWhitelist={handleWhitelistIP}
                onUnblock={handleUnblockIP}
              />
            </div>
          </div>
        </div>
        <div>
          {metrics && (
            <TwoFactorAdoption
              enabled={metrics.twoFactorEnabled}
              total={metrics.totalUsers}
              adoptionRate={metrics.twoFactorAdoptionRate}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Security Scan Results */}
      <div>
        <SecurityScanResults
          scans={securityScans}
          summary={scanSummary!}
          loading={loading}
          onRunScan={handleRunScan}
        />
      </div>
    </div>
  );
}