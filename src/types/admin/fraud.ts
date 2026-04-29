export interface FraudRule {
  id: string;
  name: string;
  description: string;
  category: 'amount' | 'velocity' | 'location' | 'device' | 'behavior' | 'custom';
  condition: string;
  action: 'flag' | 'block' | 'hold' | 'review';
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  metrics: {
    triggers: number;
    falsePositives: number;
    truePositives: number;
    accuracy: number;
    lastTriggered: string;
  };
}

export interface FlaggedTransaction {
  id: string;
  transactionId: string;
  reference: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  ruleId: string;
  ruleName: string;
  riskScore: number;
  reason: string;
  status: 'pending' | 'reviewed' | 'approved' | 'blocked';
  flaggedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface RuleTestResult {
  ruleId: string;
  ruleName: string;
  matches: boolean;
  riskScore: number;
  details: string;
  executionTime: number;
}

export interface RuleMetrics {
  totalTriggers: number;
  accuracyRate: number;
  falsePositiveRate: number;
  avgResponseTime: number;
}

export const FRAUD_CATEGORIES = [
  { value: 'amount', label: 'Amount-based', color: '#f59e0b', icon: '💰' },
  { value: 'velocity', label: 'Velocity-based', color: '#3b82f6', icon: '⚡' },
  { value: 'location', label: 'Location-based', color: '#10b981', icon: '📍' },
  { value: 'device', label: 'Device-based', color: '#8b5cf6', icon: '📱' },
  { value: 'behavior', label: 'Behavioral', color: '#ec4899', icon: '🎯' },
  { value: 'custom', label: 'Custom', color: '#6b7280', icon: '⚙️' },
];

export const RULE_ACTIONS = [
  { value: 'flag', label: 'Flag', color: '#f59e0b', description: 'Mark transaction for review' },
  { value: 'hold', label: 'Hold', color: '#3b82f6', description: 'Place transaction on hold' },
  { value: 'block', label: 'Block', color: '#ef4444', description: 'Block transaction' },
  { value: 'review', label: 'Require Review', color: '#8b5cf6', description: 'Send for manual review' },
];