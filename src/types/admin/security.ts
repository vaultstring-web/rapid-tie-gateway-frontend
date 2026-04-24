export interface SecurityMetrics {
  totalFailedLogins: number;
  failedLoginsChange: number;
  activeSessions: number;
  activeSessionsChange: number;
  blockedIPs: number;
  blockedIPsChange: number;
  twoFactorEnabled: number;
  totalUsers: number;
  twoFactorAdoptionRate: number;
  securityScore: number;
  securityScoreChange: number;
}

export interface FailedLoginData {
  hour: string;
  count: number;
  uniqueIPs: number;
}

export interface SuspiciousIP {
  ip: string;
  location: string;
  failedAttempts: number;
  lastAttempt: string;
  status: 'active' | 'blocked' | 'whitelisted';
  riskScore: number;
  attemptsByHour: Record<string, number>;
}

export interface SecurityScanResult {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'running';
  score: number;
  lastRun: string;
  details: string;
  recommendations: string[];
}

export interface SecurityScanSummary {
  total: number;
  passed: number;
  warning: number;
  failed: number;
  overallScore: number;
}

export interface FailedLoginChartData {
  hour: string;
  count: number;
  timestamp: string;
}