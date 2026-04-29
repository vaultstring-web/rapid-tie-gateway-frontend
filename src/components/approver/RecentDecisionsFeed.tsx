'use client';

import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { Decision } from '@/types/rejected.ts/dashboard';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RecentDecisionsFeedProps {
  decisions: Decision[];
  loading?: boolean;
  onViewDetails?: (decisionId: string) => void;
}

export const RecentDecisionsFeed = ({
  decisions,
  loading,
  onViewDetails,
}: RecentDecisionsFeedProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
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

  if (decisions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
        <p className="text-sm text-[var(--text-secondary)]">No recent decisions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {decisions.map((decision) => (
        <div
          key={decision.id}
          className="rounded-xl p-4 border transition-all hover:shadow-md cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
          onClick={() => onViewDetails?.(decision.id)}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${decision.decision === 'approved' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}
            >
              {decision.decision === 'approved' ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <XCircle size={18} className="text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {decision.employeeName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {decision.requestNumber} • {decision.destination}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#84cc16]">
                  {formatCurrency(decision.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  {formatDateTime(decision.decidedAt)}
                </p>
                <ChevronRight size={14} className="text-[var(--text-secondary)]" />
              </div>
              {decision.comments && (
                <p className="text-xs text-[var(--text-secondary)] mt-2 italic">
                  "{decision.comments}"
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
