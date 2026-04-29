'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Grid3x3, List, Filter, Calendar as CalendarIcon, ChevronDown, Plus, MapPin, Clock, Users, Ticket } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

// Mock data for organizer discover events (showing events from all organizers)
const generateMockEvents = (pageNum: number) => {
  const categories = ['Concert', 'Conference', 'Workshop', 'Training', 'Sports', 'Festival', 'Corporate', 'Education'];
  const cities = ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Mangochi'];
  const organizers = ['VaultString Events', 'Malawi Events Co.', 'Tech Summit MW', 'Music Fest Malawi', 'Business Forum MW'];
  
  const events = [];
  for (let i = 0; i < 9; i++) {
    const id = (pageNum - 1) * 9 + i + 1;
    events.push({
      id: `event-${id}`,
      name: `${categories[i % categories.length]} ${Math.floor(Math.random() * 100)}`,
      description: `Join us for an amazing ${categories[i % categories.length].toLowerCase()} experience in ${cities[i % cities.length]}.`,
      shortDescription: `Amazing ${categories[i % categories.length].toLowerCase()} event in ${cities[i % cities.length]}`,
      category: categories[i % categories.length],
      type: ['public', 'merchant', 'dsa-relevant'][i % 3],
      startDate: new Date(Date.now() + (i * 86400000)).toISOString(),
      endDate: new Date(Date.now() + ((i + 1) * 86400000)).toISOString(),
      venue: `${cities[i % cities.length]} Convention Center`,
      city: cities[i % cities.length],
      organizer: organizers[i % organizers.length],
      organizerId: `org-${(i % 5) + 1}`,
      imageUrl: `https://picsum.photos/seed/event${id}/400/300`,
      ticketPrice: {
        min: 5000 + (i * 5000),
        max: 50000 + (i * 10000),
      },
      attendees: Math.floor(Math.random() * 500),
      capacity: 1000,
      isTrending: i < 2,
      isSaved: false,
    });
  }
  return events;
};

const quickFilters = [
  { value: 'all', label: 'All Events', icon: '🎉' },
  { value: 'public', label: 'Public', icon: '🌍' },
  { value: 'merchant', label: 'Merchant', icon: '🛍️' },
  { value: 'dsa-relevant', label: 'DSA-Relevant', icon: '📋' },
];

const categories = ['All', 'Concert', 'Conference', 'Workshop', 'Training', 'Sports', 'Festival', 'Corporate', 'Education'];

export default function OrganizerDiscoverPage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEvents(true);
  }, []);

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
      setPage(currentPage + 1);
      setLoading(false);
    }, 800);
  }, [page]);

  // Filter events
  useEffect(() => {
    let filtered = [...events];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }
    
    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory, selectedType]);

  const handleSaveEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, isSaved: !event.isSaved } : event
    ));
    toast.success('Event saved to your list');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Discover Events</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Find events to collaborate with or attend as an organizer
          </p>
        </div>
        <Link
          href="/organizer/events/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
        >
          <Plus size={18} />
          Create Your Event
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name, location, organizer, or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedType === filter.value
                  ? 'bg-[#84cc16] text-white shadow-md'
                  : 'border border-[var(--border-color)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Category Filters and View Toggle */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]'
                    : 'text-[var(--text-secondary)] hover:text-[#84cc16]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <Filter size={18} className="text-[var(--text-secondary)]" />
            </button>
            <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#84cc16] text-white' : 'hover:bg-[var(--hover-bg)]'}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#84cc16] text-white' : 'hover:bg-[var(--hover-bg)]'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing {filteredEvents.length} events
        </p>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length === 0 && !loading ? (
        <div className="text-center py-12">
          <CalendarIcon size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No events found</h3>
          <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={filteredEvents.length}
          next={() => loadEvents(false)}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
            </div>
          }
          endMessage={
            <p className="text-center py-8 text-sm text-[var(--text-secondary)]">
              You've seen all {filteredEvents.length} events
            </p>
          }
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {event.isTrending && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-medium">
                        🔥 Trending
                      </div>
                    )}
                    <button
                      onClick={() => handleSaveEvent(event.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-all ${
                        event.isSaved ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={event.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#84cc16]/10 text-[#84cc16]">
                        {event.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {event.type === 'public' ? '🌍 Public' : event.type === 'merchant' ? '🛍️ Merchant' : '📋 DSA'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-1">
                      {event.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CalendarIcon size={14} />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <MapPin size={14} />
                      <span>{event.venue}, {event.city}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Users size={14} />
                      <span>By {event.organizer}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xs text-[var(--text-secondary)]">Starting from</span>
                        <p className="text-lg font-bold text-[#84cc16]">{formatCurrency(event.ticketPrice.min)}</p>
                      </div>
                      <Link
                        href={`/events/${event.id}`}
                        className="px-4 py-2 rounded-lg bg-[#84cc16]/10 text-[#84cc16] text-sm font-medium hover:bg-[#84cc16] hover:text-white transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                      {event.isTrending && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-medium">
                          🔥 Trending
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#84cc16]/10 text-[#84cc16]">
                              {event.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {event.type === 'public' ? '🌍 Public' : event.type === 'merchant' ? '🛍️ Merchant' : '📋 DSA'}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-[var(--text-primary)]">{event.name}</h3>
                          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSaveEvent(event.id)}
                          className={`p-2 rounded-lg transition-all ${
                            event.isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <svg className="w-5 h-5" fill={event.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                          <CalendarIcon size={14} />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                          <MapPin size={14} />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                          <Users size={14} />
                          <span>{event.attendees} attending</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-[#84cc16]">
                            {formatCurrency(event.ticketPrice.min)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <Link
                          href={`/events/${event.id}`}
                          className="flex-1 text-center px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-all"
                        >
                          View Event
                        </Link>
                        <Link
                          href={`/organizer/events/create?template=${event.id}`}
                          className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#84cc16] hover:text-[#84cc16] transition-all"
                        >
                          Copy as Template
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </InfiniteScroll>
      )}
    </div>
  );
}