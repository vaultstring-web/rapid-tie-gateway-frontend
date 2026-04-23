'use client';

import { Users } from 'lucide-react';
import { AttendeeByRole, ROLE_CONFIG } from '@/types/events/eventDetails';
import { useTheme } from '@/context/ThemeContext';

interface InterestByRoleProps {
  attendeesByRole: AttendeeByRole[];
  totalAttendees: number;
}

export const InterestByRole = ({ attendeesByRole, totalAttendees }: InterestByRoleProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-primary-green-500" />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Interest by Role
        </h3>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        {totalAttendees.toLocaleString()} people interested
      </p>

      <div className="space-y-3">
        {attendeesByRole.map((role) => {
          const config = ROLE_CONFIG[role.role];
          return (
            <div key={role.role}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{config.label}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {role.count.toLocaleString()} ({role.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${role.percentage}%`, backgroundColor: config.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};