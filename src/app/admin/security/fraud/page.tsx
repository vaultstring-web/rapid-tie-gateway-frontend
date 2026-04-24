'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Shield, Activity, AlertTriangle } from 'lucide-react';
import { FraudRulesList } from '@/components/admin/fraud/FraudRulesList';
import { FlaggedTransactionsTable } from '@/components/admin/fraud/FlaggedTransactionsTable';
import { RuleEffectivenessMetrics } from '@/components/admin/fraud/RuleEffectivenessMetrics';
import { RuleTestModal } from '@/components/admin/fraud/RuleTestModal';
import { RuleFormModal } from '@/components/admin/fraud/RuleFormModal';
import { fraudService } from '@/services/admin/fraud.service';
import { FraudRule, FlaggedTransaction, RuleMetrics } from '@/types/admin/fraud';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockRules = (): FraudRule[] => {
  return [
    {
      id: 'rule-1',
      name: 'High Value Transaction',
      description: 'Flags transactions above 100,000 MWK',
      category: 'amount',
      condition: 'amount > 100000',
      action: 'flag',
      priority: 1,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        triggers: 245,
        falsePositives: 12,
        truePositives: 233,
        accuracy: 95,
        lastTriggered: new Date().toISOString(),
      },
    },
    {
      id: 'rule-2',
      name: 'Rapid Successive Transactions',
      description: 'Detects multiple transactions in short time',
      category: 'velocity',
      condition: 'transactions_last_hour > 5',
      action: 'hold',
      priority: 2,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        triggers: 128,
        falsePositives: 8,
        truePositives: 120,
        accuracy: 93,
        lastTriggered: new Date(Date.now() - 3600000).toISOString(),
      },
    },
    {
      id: 'rule-3',
      name: 'Suspicious Location',
      description: 'Flags transactions from unusual locations',
      category: 'location',
      condition: 'location NOT IN (SELECT permitted_locations FROM user_locations WHERE user_id = customer_id)',
      action: 'review',
      priority: 3,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        triggers: 67,
        falsePositives: 15,
        truePositives: 52,
        accuracy: 77,
        lastTriggered: new Date(Date.now() - 7200000).toISOString(),
      },
    },
  ];
};

const getMockFlaggedTransactions = (): FlaggedTransaction[] => {
  return [
    {
      id: 'flag-1',
      transactionId: 'tx-1',
      reference: 'TXN-2024-001',
      amount: 150000,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      ruleId: 'rule-1',
      ruleName: 'High Value Transaction',
      riskScore: 85,
      reason: 'Transaction amount exceeds normal threshold',
      status: 'pending',
      flaggedAt: new Date().toISOString(),
    },
    {
      id: 'flag-2',
      transactionId: 'tx-2',
      reference: 'TXN-2024-002',
      amount: 25000,
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      ruleId: 'rule-2',
      ruleName: 'Rapid Successive Transactions',
      riskScore: 72,
      reason: 'Multiple transactions detected in short period',
      status: 'reviewed',
      flaggedAt: new Date(Date.now() - 3600000).toISOString(),
      reviewedAt: new Date(Date.now() - 1800000).toISOString(),
      reviewedBy: 'Admin User',
      notes: 'Verified as legitimate business activity',
    },
  ];
};

const getMockRuleMetrics = (): RuleMetrics => {
  return {
    totalTriggers: 440,
    accuracyRate: 88,
    falsePositiveRate: 8,
    avgResponseTime: 45,
  };
};

export default function FraudDetectionPage() {
  const { theme } = useTheme();
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>([]);
  const [metrics, setMetrics] = useState<RuleMetrics | null>(null);
  const [loading, setLoading] = useState({ rules: true, flagged: true });
  const [selectedRule, setSelectedRule] = useState<FraudRule | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<FraudRule | null>(null);
  const [testingRule, setTestingRule] = useState<FraudRule | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'flagged' | 'metrics'>('rules');
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadRules(),
      loadFlaggedTransactions(),
      loadMetrics(),
    ]);
  };

  const loadRules = async () => {
    setLoading(prev => ({ ...prev, rules: true }));
    try {
      const data = getMockRules();
      setRules(data);
    } catch (error) {
      console.error('Failed to load rules:', error);
      setRules(getMockRules());
    } finally {
      setLoading(prev => ({ ...prev, rules: false }));
    }
  };

  const loadFlaggedTransactions = async () => {
    setLoading(prev => ({ ...prev, flagged: true }));
    try {
      const data = getMockFlaggedTransactions();
      setFlaggedTransactions(data);
    } catch (error) {
      console.error('Failed to load flagged transactions:', error);
      setFlaggedTransactions(getMockFlaggedTransactions());
    } finally {
      setLoading(prev => ({ ...prev, flagged: false }));
    }
  };

  const loadMetrics = async () => {
    try {
      const data = getMockRuleMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setMetrics(getMockRuleMetrics());
    }
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    if (useMockData) {
      setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled } : r));
      toast.success(`Rule ${enabled ? 'enabled' : 'disabled'} (demo)`);
      return;
    }
    try {
      await fraudService.updateRule(ruleId, { enabled });
      toast.success(`Rule ${enabled ? 'enabled' : 'disabled'}`);
      loadRules();
    } catch (error) {
      toast.error('Failed to update rule');
    }
  };

  const handleReorderRules = async (ruleIds: string[]) => {
    if (useMockData) {
      const reordered = ruleIds.map((id, index) => {
        const rule = rules.find(r => r.id === id);
        return { ...rule, priority: index + 1 };
      }).filter(Boolean) as FraudRule[];
      setRules(reordered);
      toast.success('Rules reordered (demo)');
      return;
    }
    try {
      await fraudService.reorderRules(ruleIds);
      toast.success('Rules reordered');
      loadRules();
    } catch (error) {
      toast.error('Failed to reorder rules');
    }
  };

  const handleSaveRule = async (data: Partial<FraudRule>) => {
    if (useMockData) {
      if (editingRule) {
        setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r));
        toast.success('Rule updated (demo)');
      } else {
        const newRule: FraudRule = {
          id: Date.now().toString(),
          name: data.name!,
          description: data.description || '',
          category: data.category as any,
          condition: data.condition!,
          action: data.action as any,
          priority: rules.length + 1,
          enabled: data.enabled ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: {
            triggers: 0,
            falsePositives: 0,
            truePositives: 0,
            accuracy: 0,
            lastTriggered: '',
          },
        };
        setRules(prev => [...prev, newRule]);
        toast.success('Rule created (demo)');
      }
      setShowRuleForm(false);
      setEditingRule(null);
      return;
    }
    if (editingRule) {
      await fraudService.updateRule(editingRule.id, data);
      toast.success('Rule updated');
    } else {
      await fraudService.createRule(data);
      toast.success('Rule created');
    }
    await loadRules();
    setShowRuleForm(false);
    setEditingRule(null);
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (useMockData) {
      setRules(prev => prev.filter(r => r.id !== ruleId));
      toast.success('Rule deleted (demo)');
      return;
    }
    try {
      await fraudService.deleteRule(ruleId);
      toast.success('Rule deleted');
      loadRules();
    } catch (error) {
      toast.error('Failed to delete rule');
    }
  };

  const handleReviewTransaction = async (transaction: FlaggedTransaction) => {
    if (useMockData) {
      setFlaggedTransactions(prev => prev.map(t => t.id === transaction.id ? { ...t, status: 'reviewed', reviewedBy: 'Admin', reviewedAt: new Date().toISOString() } : t));
      toast.success('Transaction reviewed (demo)');
      return;
    }
  };

  const handleTestRule = async (ruleId: string, transactionData: any) => {
    if (useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const rule = rules.find(r => r.id === ruleId);
      const isMatch = transactionData.amount > 100000;
      return {
        ruleId,
        ruleName: rule?.name || '',
        matches: isMatch,
        riskScore: isMatch ? 85 : 25,
        details: isMatch ? 'Transaction amount exceeds threshold' : 'Transaction meets normal criteria',
        executionTime: 45,
      };
    }
    return await fraudService.testRule(ruleId, transactionData);
  };

  const tabs = [
    { id: 'rules', label: 'Fraud Rules', icon: Shield, badge: rules.length },
    { id: 'flagged', label: 'Flagged Transactions', icon: AlertTriangle, badge: flaggedTransactions.length },
    { id: 'metrics', label: 'Effectiveness Metrics', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Fraud Detection</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage fraud detection rules and monitor flagged transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { loadData(); toast.success('Data refreshed'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingRule(null);
              setShowRuleForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            Create Rule
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample fraud detection data. Connect to backend for live monitoring.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
                  : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#84cc16]/20 text-[#84cc16]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'rules' && (
          <FraudRulesList
            rules={rules}
            loading={loading.rules}
            onToggleRule={handleToggleRule}
            onEditRule={(rule) => {
              setEditingRule(rule);
              setShowRuleForm(true);
            }}
            onDeleteRule={handleDeleteRule}
            onReorderRules={handleReorderRules}
            onTestRule={setTestingRule}
          />
        )}

        {activeTab === 'flagged' && (
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <div className="px-5 py-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Flagged Transactions</h2>
            </div>
            <div className="p-5">
              <FlaggedTransactionsTable
                transactions={flaggedTransactions}
                loading={loading.flagged}
                onReview={handleReviewTransaction}
              />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && metrics && (
          <RuleEffectivenessMetrics metrics={metrics} loading={false} />
        )}
      </div>

      {/* Rule Form Modal */}
      <RuleFormModal
        rule={editingRule}
        isOpen={showRuleForm}
        onClose={() => {
          setShowRuleForm(false);
          setEditingRule(null);
        }}
        onSave={handleSaveRule}
      />

      {/* Rule Test Modal */}
      <RuleTestModal
        rule={testingRule}
        isOpen={!!testingRule}
        onClose={() => setTestingRule(null)}
        onTest={handleTestRule}
      />
    </div>
  );
}