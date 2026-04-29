'use client';

import { Trophy, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TopApprover {
  id: string;
  name: string;
  role: string;
  approvals: number;
  rejections: number;
  approvalRate: number;
  avgResponseTime: number;
  totalAmount: number;
}

interface TopApproversTableProps {
  approvers: TopApprover[];
  loading?: boolean;
}

export function TopApproversTable({ approvers, loading }: TopApproversTableProps) {
  const { theme } = useTheme();

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!approvers || approvers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--text-secondary)]">No data available</p>
      </div>
    );
  }

  // Helper function for rank display
  const getRankDisplay = (index: number) => {
    if (index === 0) {
      return <Trophy size={16} className="text-yellow-500" />;
    }
    if (index === 1) {
      return <Trophy size={16} className="text-gray-400" />;
    }
    if (index === 2) {
      return <Trophy size={16} className="text-amber-600" />;
    }
    return <span className="text-xs text-[var(--text-secondary)]">#{index + 1}</span>;
  };

  // Helper function for approval rate color
  const getRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Approver
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Approvals
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Rejections
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Approval Rate
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Avg Response
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {approvers.map((approver, index) => (
            <tr key={approver.id} className="hover:bg-[var(--hover-bg)] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center justify-center w-8">
                  {getRankDisplay(index)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {approver.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {approver.role}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {approver.approvals}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {approver.rejections}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-sm font-semibold ${getRateColor(approver.approvalRate)}`}>
                    {approver.approvalRate}%
                  </span>
                  {approver.approvalRate > 75 && <TrendingUp size={12} className="text-green-500" />}
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-sm text-[var(--text-primary)]">
                  {approver.avgResponseTime} hrs
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-semibold text-[#84cc16]">
                  {formatCurrency(approver.totalAmount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}