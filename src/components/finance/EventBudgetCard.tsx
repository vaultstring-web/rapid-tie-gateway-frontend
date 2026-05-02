'use client';

import { AlertTriangle } from 'lucide-react';
import { EventBudget } from '@/types/finance/budgets';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface EventBudgetCardProps {
  eventBudget: EventBudget;
}

export const EventBudgetCard = ({ eventBudget }: EventBudgetCardProps) => {
  const { theme } = useTheme();

  const getProgressColor = () => {
    if (eventBudget.percentageUsed >= 90) return 'bg-red-500';
    if (eventBudget.percentageUsed >= 75) return 'bg-yellow-500';
    return 'bg-[#84cc16]';
  };

  const isNearLimit = eventBudget.percentageUsed >= 75;

  return (
    <div
      className="rounded-lg p-3 border"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">{eventBudget.eventName}</p>
            {isNearLimit && (
              <AlertTriangle size={12} className="text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)]">{formatDate(eventBudget.eventDate)}</p>
        </div>
        <p className={`text-sm font-semibold ${
          eventBudget.status === 'healthy' ? 'text-green-600 dark:text-green-400' :
          eventBudget.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
          'text-red-600 dark:text-red-400'
        }`}>
          {eventBudget.percentageUsed}%
        </p>
      </div>

      <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${getProgressColor()}`}
          style={{ width: `${eventBudget.percentageUsed}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-[var(--text-secondary)]">Remaining:</span>
        <span className="font-medium text-[var(--text-primary)]">{formatCurrency(eventBudget.remaining)}</span>
      </div>
      <div className="flex justify-between text-xs mt-0.5">
        <span className="text-[var(--text-secondary)]">Allocated:</span>
        <span className="text-[var(--text-primary)]">{formatCurrency(eventBudget.allocated)}</span>
      </div>
    </div>
  );
};