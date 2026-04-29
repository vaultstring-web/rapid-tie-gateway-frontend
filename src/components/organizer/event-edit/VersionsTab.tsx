'use client';

import { useState, useEffect } from 'react';
import { Clock, User, GitBranch } from 'lucide-react';
import { EventVersion } from '@/types/organizer/eventEdit';
import { eventEditService } from '@/services/organizer/eventEdit.service';
import { useTheme } from '@/context/ThemeContext';

interface VersionsTabProps {
  eventId: string;
}

export const VersionsTab = ({ eventId }: VersionsTabProps) => {
  const { theme } = useTheme();
  const [versions, setVersions] = useState<EventVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, [eventId]);

  const loadVersions = async () => {
    try {
      const data = await eventEditService.getEventVersions(eventId);
      setVersions(data);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <GitBranch size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No version history available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version, idx) => (
        <div
          key={version.id}
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-green-100 dark:bg-primary-green-900/30">
                <GitBranch size={18} className="text-primary-green-500" />
              </div>
              <div>
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Version {version.version}
                </h4>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {version.changes}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(version.publishedAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={10} />
                    {version.publishedBy}
                  </span>
                </div>
              </div>
            </div>
            {idx === 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Current
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};