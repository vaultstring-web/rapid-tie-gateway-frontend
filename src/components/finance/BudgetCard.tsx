'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp } from 'lucide-react';
import { DepartmentBudget } from '@/types/finance/budgets';
import { EventBudgetCard } from './EventBudgetCard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface BudgetCardProps {
  budget: DepartmentBudget;
  onViewDetails: (departmentId: string) => void;
}

export const BudgetCard = ({ budget, onViewDetails }: BudgetCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (budget.status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressColor = () => {
    if (budget.percentageUsed >= 90) return 'bg-red-500';
    if (budget.percentageUsed >= 75) return 'bg-yellow-500';
    return 'bg-[#84cc16]';
  };

  const isNearLimit = budget.percentageUsed >= 75;

  return (
    <div
      className="rounded-xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{budget.department}</h3>
              {isNearLimit && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center gap-1`}>
                  <AlertTriangle size={10} />
                  Near Limit
                </span>
              )}
              {budget.percentageUsed >= 90 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  Critical
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-[#84cc16]">{formatCurrency(budget.remaining)}</span>
              <span className="text-sm text-[var(--text-secondary)]">remaining</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--text-secondary)]">Utilization</p>
            <p className={`text-xl font-bold ${getStatusColor()}`}>{budget.percentageUsed}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">Spent: {formatCurrency(budget.spent)}</span>
            <span className="text-[var(--text-secondary)]">of {formatCurrency(budget.allocated)}</span>
          </div>
          <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${budget.percentageUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-[var(--text-secondary)]">Committed: {formatCurrency(budget.committed)}</span>
          </div>
        </div>

        {/* Alert Banner for Near-Limit Budgets */}
        {isNearLimit && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  {budget.percentageUsed >= 90 
                    ? 'Critical Budget Alert' 
                    : 'Budget Warning'}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Only {formatCurrency(budget.remaining)} remaining. Please review upcoming commitments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onViewDetails(budget.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <TrendingUp size={14} />
            View Details
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Expanded - Event Budgets */}
        {expanded && budget.eventBudgets.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Event Budgets</p>
            {budget.eventBudgets.map((eventBudget) => (
              <EventBudgetCard key={eventBudget.id} eventBudget={eventBudget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};