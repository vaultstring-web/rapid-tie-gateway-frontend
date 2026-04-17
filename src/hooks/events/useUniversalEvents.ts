'use client';

import { useState, useEffect, useCallback } from 'react';
import { universalEventService } from '@/services/events/universalEvent.service';
import { UniversalEvent, EventFilter, EventTab } from '@/types/events/universalEvent';
import toast from 'react-hot-toast';

interface UseUniversalEventsReturn {
  events: UniversalEvent[];
  loading: boolean;
  hasMore: boolean;
  total: number;
  currentTab: EventTab;
  filters: EventFilter;
  trendingEvents: UniversalEvent[];
  savedEvents: string[];
  loadMore: () => Promise<void>;
  changeTab: (tab: EventTab) => void;
  updateFilters: (filters: EventFilter) => void;
  toggleSaveEvent: (eventId: string, saved: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useUniversalEvents = (initialTab: EventTab = 'for-you'): UseUniversalEventsReturn => {
  const [events, setEvents] = useState<UniversalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<EventTab>(initialTab);
  const [filters, setFilters] = useState<EventFilter>({});
  const [trendingEvents, setTrendingEvents] = useState<UniversalEvent[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);

  const fetchEvents = useCallback(async (reset: boolean = true) => {
    const currentPage = reset ? 1 : page;
    setLoading(reset);

    try {
      const response = await universalEventService.getEvents(
        currentTab,
        currentPage,
        20,
        filters
      );

      if (reset) {
        setEvents(response.events);
      } else {
        setEvents(prev => [...prev, ...response.events]);
      }
      
      setHasMore(response.hasMore);
      setTotal(response.total);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [currentTab, filters, page]);

  const fetchTrendingEvents = useCallback(async () => {
    try {
      const events = await universalEventService.getTrendingEvents();
      setTrendingEvents(events);
    } catch (error) {
      console.error('Failed to fetch trending events:', error);
    }
  }, []);

  const fetchSavedEvents = useCallback(async () => {
    try {
      const saved = await universalEventService.getSavedEvents();
      setSavedEvents(saved);
      // Update saved status in events
      setEvents(prev => prev.map(event => ({
        ...event,
        isSaved: saved.includes(event.id),
      })));
    } catch (error) {
      console.error('Failed to fetch saved events:', error);
    }
  }, []);

  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchEvents(false);
    }
  };

  const changeTab = async (tab: EventTab) => {
    setCurrentTab(tab);
    setPage(1);
    setEvents([]);
    await fetchEvents(true);
  };

  const updateFilters = (newFilters: EventFilter) => {
    setFilters(newFilters);
    setPage(1);
    setEvents([]);
    fetchEvents(true);
  };

  const toggleSaveEvent = async (eventId: string, saved: boolean) => {
    try {
      if (saved) {
        await universalEventService.saveEvent(eventId);
        setSavedEvents(prev => [...prev, eventId]);
        toast.success('Event saved');
      } else {
        await universalEventService.unsaveEvent(eventId);
        setSavedEvents(prev => prev.filter(id => id !== eventId));
        toast.success('Event removed');
      }
      
      // Update local events
      setEvents(prev => prev.map(event =>
        event.id === eventId ? { ...event, isSaved: saved } : event
      ));
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const refresh = async () => {
    setPage(1);
    await Promise.all([
      fetchEvents(true),
      fetchTrendingEvents(),
      fetchSavedEvents(),
    ]);
  };

  useEffect(() => {
    fetchEvents(true);
    fetchTrendingEvents();
    fetchSavedEvents();
  }, []);

  return {
    events,
    loading,
    hasMore,
    total,
    currentTab,
    filters,
    trendingEvents,
    savedEvents,
    loadMore,
    changeTab,
    updateFilters,
    toggleSaveEvent,
    refresh,
  };
};