'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Grid3x3, List, Filter, SlidersHorizontal, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EventCard } from '@/components/events/EventCard';
import { EventFilterSidebar } from '@/components/events/EventFilterSidebar';
import { Event, EventFilters, ViewMode, EVENT_CATEGORIES, EVENT_TYPES } from '@/types/events/eventDiscovery';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function EventDiscoveryPage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<EventFilters>({});
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock events data (replace with API call)
  const generateMockEvents = (pageNum: number): Event[] => {
    const mockEvents: Event[] = [];
    const categories = ['concert', 'conference', 'workshop', 'training', 'sports', 'festival', 'corporate', 'education'];
    const cities = ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi'];
    const types = ['public', 'merchant', 'dsa-relevant'];
    
    for (let i = 0; i < 12; i++) {
      const id = (pageNum - 1) * 12 + i + 1;
      mockEvents.push({
        id: `event-${id}`,
        name: `Amazing ${categories[i % categories.length]} Event ${id}`,
        description: `Join us for an incredible ${categories[i % categories.length]} experience in ${cities[i % cities.length]}. This event features amazing speakers, networking opportunities, and much more.`,
        shortDescription: `Join us for an incredible ${categories[i % categories.length]} experience in ${cities[i % cities.length]}.`,
        category: categories[i % categories.length] as any,
        type: types[i % types.length] as any,
        startDate: new Date(Date.now() + (i * 86400000)).toISOString(),
        endDate: new Date(Date.now() + ((i + 1) * 86400000)).toISOString(),
        venue: `${cities[i % cities.length]} Convention Center`,
        city: cities[i % cities.length],
        country: 'Malawi',
        imageUrl: '',
        ticketPrice: {
          min: 5000 + (i * 5000),
          max: 50000 + (i * 10000),
        },
        attendees: Math.floor(Math.random() * 500),
        capacity: 1000,
        isTrending: i < 3,
        isSaved: false,
        organizer: {
          id: `org-${i}`,
          name: `Organizer ${i + 1}`,
        },
      });
    }
    return mockEvents;
  };

  const loadEvents = useCallback(async (reset: boolean = false) => {
    const currentPage = reset ? 1 : page;
    setLoading(reset);
    
    // Simulate API call
    setTimeout(() => {
      const newEvents = generateMockEvents(currentPage);
      if (reset) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      setHasMore(currentPage < 5);
      setTotal(60);
      setPage(currentPage + 1);
      setLoading(false);
    }, 800);
  }, [page]);

  useEffect(() => {
    loadEvents(true);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...events];
    
    // Apply type filter from quick tabs
    if (activeTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === activeTypeFilter);
    }
    
    // Apply search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }
    
    // Apply category filters
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(event => filters.category?.includes(event.category));
    }
    
    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(event => event.city === filters.city);
    }
    
    // Apply price filter
    if (filters.minPrice) {
      filtered = filtered.filter(event => event.ticketPrice.min >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(event => event.ticketPrice.max <= filters.maxPrice!);
    }
    
    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(event => new Date(event.startDate) >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(event => new Date(event.endDate) <= filters.endDate!);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'date':
          filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          break;
        case 'price_asc':
          filtered.sort((a, b) => a.ticketPrice.min - b.ticketPrice.min);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.ticketPrice.min - a.ticketPrice.min);
          break;
        case 'popularity':
          filtered.sort((a, b) => b.attendees - a.attendees);
          break;
      }
    }
    
    setFilteredEvents(filtered);
  }, [events, debouncedSearch, filters, activeTypeFilter]);

  const handleSaveToggle = (eventId: string, saved: boolean) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, isSaved: saved } : event
    ));
    toast.success(saved ? 'Event saved' : 'Event removed');
  };

  const quickFilters = [
    { value: 'all', label: 'All Events', icon: '🎉' },
    { value: 'public', label: 'Public', icon: '🌍' },
    { value: 'merchant', label: 'Merchant', icon: '🛍️' },
    { value: 'dsa-relevant', label: 'DSA-Relevant', icon: '📋' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Discover Events
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Find and join amazing events happening near you
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name, location, or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-green-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <Filter size={16} />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-primary-green-500" />
              )}
            </button>
            
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-green-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                style={{ backgroundColor: viewMode === 'grid' ? undefined : 'var(--bg-secondary)' }}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-green-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                style={{ backgroundColor: viewMode === 'list' ? undefined : 'var(--bg-secondary)' }}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveTypeFilter(filter.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                activeTypeFilter === filter.value
                  ? 'bg-primary-green-500 text-white shadow-md'
                  : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                borderColor: activeTypeFilter === filter.value ? undefined : 'var(--border-color)',
                backgroundColor: activeTypeFilter === filter.value ? undefined : 'var(--bg-secondary)',
              }}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredEvents.length} of {total} events
          </p>
        </div>

        {/* Events Grid/List */}
        <InfiniteScroll
          dataLength={filteredEvents.length}
          next={() => loadEvents(false)}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
          endMessage={
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
              You've seen all {total} events
            </p>
          }
        >
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
          }>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                viewMode={viewMode}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        </InfiniteScroll>

        {/* Loading State */}
        {loading && filteredEvents.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No events found
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <EventFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => setIsFilterOpen(false)}
        onReset={() => setFilters({})}
      />
    </div>
  );
}