'use client';

import { CheckCircle, User, Clock, Wifi, WifiOff } from 'lucide-react';
import { CheckinRecord } from '@/types/organizer/checkin';
import { useTheme } from '@/context/ThemeContext';

interface RecentCheckinsFeedProps {
  checkins: CheckinRecord[];
  loading?: boolean;
  isOffline?: boolean;
}

export const RecentCheckinsFeed = ({ checkins, loading, isOffline }: RecentCheckinsFeedProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (checkins.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCheck size={32} className="mx-auto mb-3 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No check-ins yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {checkins.map((checkin) => (
        <div
          key={checkin.id}
          className="rounded-xl p-4 border transition-all hover:shadow-md"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {checkin.attendeeName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {checkin.ticketNumber} • {checkin.tierName}
                  </p>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(checkin.checkedInAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {checkin.method === 'qr' ? 'QR Scan' : checkin.method === 'manual' ? 'Manual Entry' : 'Offline'}
                </span>
                {checkin.method === 'offline' && !checkin.synced && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                    <WifiOff size={10} />
                    Pending Sync
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};