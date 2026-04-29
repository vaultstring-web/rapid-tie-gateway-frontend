'use client';

import { TrendingUp, Calendar, Home, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface CalculationPreviewProps {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  perDiemRate: number;
  accommodationRate: number;
  totalAmount: number;
  loading?: boolean;
}

export const CalculationPreview = ({
  destination,
  startDate,
  endDate,
  duration,
  perDiemRate,
  accommodationRate,
  totalAmount,
  loading,
}: CalculationPreviewProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    );
  }

  if (!destination || !startDate || !endDate) {
    return (
      <div className="rounded-xl p-5 border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <DollarSign size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
        <p className="text-sm text-[var(--text-secondary)]">Enter destination and dates to see calculation</p>
      </div>
    );
  }

  const items = [
    { label: 'Duration', value: `${duration} day${duration !== 1 ? 's' : ''}`, icon: Calendar, color: 'text-blue-500' },
    { label: 'Per Diem Rate', value: formatCurrency(perDiemRate), subValue: 'per day', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Accommodation', value: formatCurrency(accommodationRate), subValue: 'per night', icon: Home, color: 'text-purple-500' },
  ];

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">DSA Calculation Preview</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center p-3 rounded-lg bg-[var(--bg-primary)]">
                <Icon size={18} className={`mx-auto mb-2 ${item.color}`} />
                <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</p>
                {item.subValue && (
                  <p className="text-[10px] text-[var(--text-secondary)]">{item.subValue}</p>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">Total DSA Amount</span>
            <span className="text-2xl font-bold text-[#84cc16]">{formatCurrency(totalAmount)}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Based on {duration} days in {destination}
          </p>
        </div>
      </div>
    </div>
  );
};