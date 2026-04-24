'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { SecurityScanResult, SecurityScanSummary } from '@/types/admin/security';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface SecurityScanResultsProps {
  scans: SecurityScanResult[];
  summary: SecurityScanSummary;
  loading?: boolean;
  onRunScan?: () => Promise<void>;
}

export const SecurityScanResults = ({ scans, summary, loading, onRunScan }: SecurityScanResultsProps) => {
  const { theme } = useTheme();
  const [expandedScan, setExpandedScan] = useState<string | null>(null);
  const [runningScan, setRunningScan] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'running':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      default:
        return <Shield size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'running':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleRunScan = async () => {
    if (!onRunScan) return;
    setRunningScan(true);
    try {
      await onRunScan();
      toast.success('Security scan completed');
    } catch (error) {
      toast.error('Failed to run security scan');
    } finally {
      setRunningScan(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-[#84cc16]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Security Scans</h3>
        </div>
        <button
          onClick={handleRunScan}
          disabled={runningScan}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[#84cc16] text-white hover:brightness-110 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={runningScan ? 'animate-spin' : ''} />
          Run Scan
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-3 rounded-lg bg-[var(--bg-primary)]">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">{summary.passed}</p>
          <p className="text-xs text-[var(--text-secondary)]">Passed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">{summary.warning}</p>
          <p className="text-xs text-[var(--text-secondary)]">Warnings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{summary.failed}</p>
          <p className="text-xs text-[var(--text-secondary)]">Failed</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p className="text-sm text-[var(--text-secondary)]">Overall Security Score</p>
        <p className={`text-3xl font-bold ${getScoreColor(summary.overallScore)}`}>{summary.overallScore}%</p>
      </div>

      {/* Scan Results List */}
      <div className="space-y-3">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
              onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(scan.status)}
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{scan.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Last run: {formatDateTime(scan.lastRun)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scan.status)}`}>
                  {scan.status.toUpperCase()}
                </span>
                <span className={`text-sm font-bold ${getScoreColor(scan.score)}`}>{scan.score}%</span>
                {expandedScan === scan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            
            {expandedScan === scan.id && (
              <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                <p className="text-sm text-[var(--text-primary)] mb-2">{scan.details}</p>
                {scan.recommendations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {scan.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs text-[var(--text-secondary)]">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};