'use client';

import { Shield, UserCheck, Users } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TwoFactorAdoptionProps {
  enabled: number;
  total: number;
  adoptionRate: number;
  loading?: boolean;
}

export const TwoFactorAdoption = ({ enabled, total, adoptionRate, loading }: TwoFactorAdoptionProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="rounded-xl p-5 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Shield size={20} className="text-[#84cc16]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">2FA Adoption</h3>
      </div>

      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-[#84cc16]">{adoptionRate}%</p>
        <p className="text-sm text-[var(--text-secondary)]">of users have 2FA enabled</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-500" />
            <span className="text-[var(--text-primary)]">Enabled</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)]">{enabled.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-yellow-500" />
            <span className="text-[var(--text-primary)]">Not Enabled</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)]">{(total - enabled).toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#84cc16] rounded-full transition-all"
            style={{ width: `${adoptionRate}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <UserCheck size={14} />
          <span>{enabled.toLocaleString()} out of {total.toLocaleString()} users</span>
        </div>
      </div>
    </div>
  );
};