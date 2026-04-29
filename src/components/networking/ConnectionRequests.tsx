'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserPlus, Check, X, Briefcase, MapPin, Users } from 'lucide-react';
import { SuggestedConnection, ROLE_BADGE_COLORS } from '@/types/events/eventNetworking';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface NetworkingSuggestionsProps {
  suggestions: SuggestedConnection[];
  onConnect: (userId: string) => void;
  loading?: boolean;
}

export const NetworkingSuggestions = ({ suggestions, onConnect, loading }: NetworkingSuggestionsProps) => {
  const { theme } = useTheme();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (userId: string) => {
    setConnecting(userId);
    await onConnect(userId);
    setConnecting(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Users size={32} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          No suggestions yet
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Attend more events to get networking suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.attendee.id}
          className="rounded-xl p-4 transition-all hover:shadow-md border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={suggestion.attendee.avatar || '/images/default-avatar.png'}
                alt={suggestion.attendee.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {suggestion.attendee.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE_COLORS[suggestion.attendee.role]}`}>
                      {suggestion.attendee.role}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {suggestion.attendee.company}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-primary-green-500">
                    {suggestion.matchScore}% Match
                  </span>
                </div>
              </div>

              <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {suggestion.attendee.bio}
              </p>

              {/* Mutual Events */}
              {suggestion.mutualEvents.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    🤝 Mutual events you'll both attend:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.mutualEvents.map((event) => (
                      <div
                        key={event.eventId}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                        style={{
                          backgroundColor: 'var(--hover-bg)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>{event.eventName}</span>
                        <span className="text-primary-green-500">•</span>
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mutual Interests */}
              {suggestion.mutualInterests > 0 && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                  🎯 {suggestion.mutualInterests} mutual interests
                </p>
              )}

              {/* Suggested Reason */}
              <p className="text-xs mt-2 italic" style={{ color: 'var(--text-secondary)' }}>
                💡 {suggestion.suggestedReason}
              </p>

              {/* Connect Button */}
              <button
                onClick={() => handleConnect(suggestion.attendee.id)}
                disabled={connecting === suggestion.attendee.id}
                className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-primary-green-500 text-white hover:bg-primary-green-600 disabled:opacity-50"
              >
                {connecting === suggestion.attendee.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};