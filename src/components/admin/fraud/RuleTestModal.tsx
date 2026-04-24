'use client';

import { useState } from 'react';
import { X, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { FraudRule, RuleTestResult } from '@/types/admin/fraud';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface RuleTestModalProps {
  rule: FraudRule | null;
  isOpen: boolean;
  onClose: () => void;
  onTest: (ruleId: string, transactionData: any) => Promise<RuleTestResult>;
}

export const RuleTestModal = ({ rule, isOpen, onClose, onTest }: RuleTestModalProps) => {
  const { theme } = useTheme();
  const [transactionData, setTransactionData] = useState({
    amount: 50000,
    customerId: 'CUST-001',
    location: 'Lilongwe',
    deviceId: 'DEV-001',
    hourOfDay: 14,
  });
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<RuleTestResult | null>(null);

  if (!isOpen || !rule) return null;

  const handleTest = async () => {
    setTesting(true);
    try {
      const testResult = await onTest(rule.id, transactionData);
      setResult(testResult);
      toast.success('Rule test completed');
    } catch (error) {
      toast.error('Failed to test rule');
    } finally {
      setTesting(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-2">
            <Play size={18} className="text-[#84cc16]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Test Rule: {rule.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Test Data Input */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Transaction Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Amount (MWK)</label>
                <input
                  type="number"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Customer ID</label>
                <input
                  type="text"
                  value={transactionData.customerId}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, customerId: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Location</label>
                <input
                  type="text"
                  value={transactionData.location}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Device ID</label>
                <input
                  type="text"
                  value={transactionData.deviceId}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, deviceId: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Hour of Day</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={transactionData.hourOfDay}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, hourOfDay: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Test Button */}
          <button
            onClick={handleTest}
            disabled={testing}
            className="w-full py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play size={16} />
            )}
            Run Test
          </button>

          {/* Test Results */}
          {result && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Test Results</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)]">
                  <span className="text-sm text-[var(--text-secondary)]">Matches Rule</span>
                  {result.matches ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-red-500">Yes - Flagged</span>
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-green-500">No - Passed</span>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)]">
                  <span className="text-sm text-[var(--text-secondary)]">Risk Score</span>
                  <span className={`text-lg font-bold ${getRiskColor(result.riskScore)}`}>{result.riskScore}%</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-primary)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Details</p>
                  <p className="text-sm text-[var(--text-primary)]">{result.details}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)]">
                  <span className="text-sm text-[var(--text-secondary)]">Execution Time</span>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{result.executionTime}ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};