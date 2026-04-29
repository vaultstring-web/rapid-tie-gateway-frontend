'use client';

import { Calculator, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface DsaCalculationTableProps {
  perDiemRate: number;
  accommodationRate?: number;
  otherExpenses?: number;
  duration: number;
  totalAmount: number;
}

export const DsaCalculationTable = ({
  perDiemRate,
  accommodationRate,
  otherExpenses,
  duration,
  totalAmount,
}: DsaCalculationTableProps) => {
  const { theme } = useTheme();

  const perDiemTotal = perDiemRate * duration;
  const accommodationTotal = accommodationRate ? accommodationRate * duration : 0;
  const otherExpensesTotal = otherExpenses || 0;

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} className="text-[#84cc16]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">DSA Calculation Breakdown</h3>
      </div>

      <div className="space-y-3">
        {/* Per Diem */}
        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Per Diem Allowance</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {formatCurrency(perDiemRate)} × {duration} days
            </p>
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(perDiemTotal)}</p>
        </div>

        {/* Accommodation */}
        {accommodationRate && accommodationRate > 0 && (
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Accommodation Allowance</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {formatCurrency(accommodationRate)} × {duration} nights
              </p>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(accommodationTotal)}</p>
          </div>
        )}

        {/* Other Expenses */}
        {otherExpenses && otherExpenses > 0 && (
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Other Expenses</p>
              <p className="text-xs text-[var(--text-secondary)]">Transport, incidentals, etc.</p>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(otherExpenses)}</p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 mt-2 border-t-2" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-[#84cc16]" />
            <p className="text-base font-bold text-[var(--text-primary)]">Total Amount</p>
          </div>
          <p className="text-xl font-bold text-[#84cc16]">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {/* Calculation Note */}
      <div className="mt-4 p-3 rounded-lg bg-[var(--hover-bg)]">
        <p className="text-xs text-[var(--text-secondary)]">
          * Based on approved DSA rates for {new Date().getFullYear()}. Rates are subject to change based on location and employee grade.
        </p>
      </div>
    </div>
  );
};