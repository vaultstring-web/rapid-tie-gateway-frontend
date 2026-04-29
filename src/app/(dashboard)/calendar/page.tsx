'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/en-gb';
import { CalendarEvent as CalendarEventType } from '@/types/events/eventCalendar';
import { EventModal } from '@/components/events/EventModal';
import { CalendarToolbar } from '@/components/events/CalendarToolbar';
import { CalendarFilterPanel } from '@/components/events/CalendarFilterPanel';
import { eventCalendarService } from '@/services/events/eventCalendar.service';
import { EVENT_CATEGORY_COLORS, EVENT_ROLE_COLORS } from '@/types/events/eventCalendar';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

export default function EventCalendarPage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['public', 'merchant', 'dsa-relevant']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Load events
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + 2);
      
      const fetchedEvents = await eventCalendarService.getEvents(startDate, endDate, {
        role: selectedRoles,
        category: selectedCategories,
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [currentDate, selectedRoles, selectedCategories]);

  // Reload when filters change
  useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  // Event style getter
  const eventStyleGetter = useCallback((event: CalendarEventType) => {
    const roleColor = EVENT_ROLE_COLORS[event.role];
    const categoryColor = EVENT_CATEGORY_COLORS[event.category];
    
    return {
      style: {
        backgroundColor: roleColor,
        borderRadius: '4px',
        border: `2px solid ${categoryColor}`,
        color: 'white',
        padding: '2px 4px',
        fontSize: '12px',
        fontWeight: '500',
      },
    };
  }, []);

  // Handle event click
  const handleSelectEvent = (event: CalendarEventType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Handle save toggle
  const handleSaveToggle = async (eventId: string, saved: boolean) => {
    try {
      if (saved) {
        await eventCalendarService.saveEvent(eventId);
        toast.success('Event saved');
      } else {
        await eventCalendarService.unsaveEvent(eventId);
        toast.success('Event removed');
      }
      
      // Update local events
      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, isSaved: saved } : e
      ));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent({ ...selectedEvent, isSaved: saved });
      }
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date(currentDate);
      endDate.setMonth(endDate.getMonth() + 2);
      
      const blob = await eventCalendarService.exportCalendar(startDate, endDate, 'ics');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-${startDate.toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Calendar exported');
    } catch (error) {
      toast.error('Failed to export calendar');
    }
  };

  // Handle role toggle
  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Handle filter apply
  const handleFilterApply = () => {
    setIsFilterOpen(false);
    loadEvents();
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setSelectedRoles(['public', 'merchant', 'dsa-relevant']);
    setSelectedCategories([]);
    setIsFilterOpen(false);
    loadEvents();
  };

  // Initial load
  useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  // Transform events for calendar
  const calendarEvents = events.map(event => ({
    ...event,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Event Calendar
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            View and manage all your events in one place
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Event Types:</span>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_ROLE_COLORS.public }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Public</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_ROLE_COLORS.merchant }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Merchant</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_ROLE_COLORS['dsa-relevant'] }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>DSA-Relevant</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            components={{
              toolbar: (props) => (
                <CalendarToolbar
                  {...props}
                  onExport={handleExport}
                  onFilterClick={() => setIsFilterOpen(true)}
                />
              ),
            }}
            messages={{
              next: 'Next',
              previous: 'Previous',
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              agenda: 'Agenda',
            }}
          />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveToggle={handleSaveToggle}
      />

      {/* Filter Panel */}
      <CalendarFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedRoles={selectedRoles}
        selectedCategories={selectedCategories}
        onRoleToggle={handleRoleToggle}
        onCategoryToggle={handleCategoryToggle}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
    </div>
  );
}