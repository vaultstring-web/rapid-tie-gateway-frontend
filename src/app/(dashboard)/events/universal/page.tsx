'use client';

import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Filter, TrendingUp, Sparkles, Calendar, MapPin, DollarSign } from 'lucide-react';
import { UniversalEventCard } from '@/components/events/UniversalEventCard';
import { EventFilterSidebar } from '@/components/events/EventFilterSidebar';
import { useUniversalEvents } from '@/hooks/events/useUniversalEvents';
import { EventTab } from '@/types/events/universalEvent';
import { useTheme } from '@/context/ThemeContext';

const TABS: { id: EventTab; label: string; icon: React.ReactNode }[] = [
  { id: 'for-you', label: 'For You', icon: <Sparkles size={16} /> },
  { id: 'public', label: 'Public', icon: <TrendingUp size={16} /> },
  { id: 'merchant', label: 'Merchant', icon: <TrendingUp size={16} /> },
  { id: 'dsa-relevant', label: 'DSA-Relevant', icon: <TrendingUp size={16} /> },
];

export default function UniversalEventsPage() {
  const { theme } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    events,
    loading,
    hasMore,
    total,
    currentTab,
    filters,
    trendingEvents,
    loadMore,
    changeTab,
    updateFilters,
    toggleSaveEvent,
  } = useUniversalEvents('for-you');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Discover Events
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Find and join events tailored for you
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all
                ${currentTab === tab.id
                  ? 'border-b-2 border-primary-green-500 text-primary-green-500'
                  : 'hover:text-primary-green-500'
                }
              `}
              style={{ color: currentTab === tab.id ? undefined : 'var(--text-secondary)' }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {total} events found
          </p>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Filter size={16} />
            Filter
            {Object.keys(filters).length > 0 && (
              <span className="w-2 h-2 bg-primary-green-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Trending Section */}
        {trendingEvents.length > 0 && currentTab === 'for-you' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-orange-500" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Trending in Your Role
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingEvents.slice(0, 3).map((event) => (
                <UniversalEventCard
                  key={event.id}
                  event={event}
                  onSaveToggle={toggleSaveEvent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Events Grid with Infinite Scroll */}
        <InfiniteScroll
          dataLength={events.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
          endMessage={
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
              You've seen all {total} events
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <UniversalEventCard
                key={event.id}
                event={event}
                onSaveToggle={toggleSaveEvent}
              />
            ))}
          </div>
        </InfiniteScroll>

        {/* Loading State */}
        {loading && events.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Calendar size={32} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No events found
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <EventFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilters}
        onApply={() => setIsFilterOpen(false)}
        onReset={() => updateFilters({})}
      />
    </div>
  );
}