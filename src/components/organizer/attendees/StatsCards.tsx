'use client';

import { Users, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { AttendeeStats } from '@/types/organizer/attendees';

interface StatsCardsProps {
  stats: AttendeeStats;
  loading?: boolean;
  onRefresh?: () => void;
}

export const StatsCards = ({ stats, loading, onRefresh }: StatsCardsProps) => {
  const cards = [
    { title: 'Total Attendees', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Checked In', value: stats.checkedIn, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Not Checked In', value: stats.notCheckedIn, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { title: 'Refunded', value: stats.refunded, icon: RefreshCw, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
    { title: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  ];

  const checkinRate = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={16} className={card.color} />
                </div>
                {onRefresh && (
                  <button onClick={onRefresh} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <RefreshCw size={14} className="text-[var(--text-secondary)]" />
                  </button>
                )}
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value.toLocaleString()}</p>
              <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
            </div>
          );
        })}
      </div>
      
      {/* Check-in Rate Progress */}
      <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">Overall Check-in Rate</span>
          <span className="text-sm font-bold text-[#84cc16]">{checkinRate}%</span>
        </div>
        <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
          <div className="h-full bg-[#84cc16] rounded-full transition-all" style={{ width: `${checkinRate}%` }} />
        </div>
      </div>
    </div>
  );
};