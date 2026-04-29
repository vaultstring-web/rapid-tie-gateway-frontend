'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, DollarSign, User, AlertCircle } from 'lucide-react';
import { CalendarEvent, EVENT_TYPE_CONFIG } from '@/types/approver/calendar';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface ApproverCalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  loading?: boolean;
}

export const ApproverCalendarView = ({ events, onEventClick, loading }: ApproverCalendarViewProps) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventIcon = (type: string) => {
    const config = EVENT_TYPE_CONFIG[type as keyof typeof EVENT_TYPE_CONFIG];
    return config?.icon || '📅';
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--border-color)' }}>
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-semibold text-[var(--text-secondary)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[100px] p-2 border-r border-b last:border-r-0"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              );
            }

            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 transition-colors ${
                  isWeekend ? 'bg-[var(--bg-primary)]/50' : ''
                }`}
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-[#84cc16] font-bold' : 'text-[var(--text-primary)]'
                  }`}>
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs text-[var(--text-secondary)]">
                      {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left p-1 rounded-md text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-1">
                        <span>{getEventIcon(event.type)}</span>
                        <span className="truncate text-[var(--text-primary)]">{event.title}</span>
                      </div>
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <button
                      onClick={() => setSelectedEvent(dayEvents[3])}
                      className="text-xs text-[#84cc16] hover:underline"
                    >
                      +{dayEvents.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getEventIcon(selectedEvent.type)}</span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Calendar size={14} />
                <span>{formatDate(selectedEvent.start)}</span>
                {selectedEvent.end && (
                  <>
                    <span>-</span>
                    <span>{formatDate(selectedEvent.end)}</span>
                  </>
                )}
              </div>

              {selectedEvent.requestNumber && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <span>📋</span>
                  <span>Request: {selectedEvent.requestNumber}</span>
                </div>
              )}

              {selectedEvent.employeeName && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <User size={14} />
                  <span>{selectedEvent.employeeName}</span>
                </div>
              )}

              {selectedEvent.destination && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <MapPin size={14} />
                  <span>{selectedEvent.destination}</span>
                </div>
              )}

              {selectedEvent.amount && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <DollarSign size={14} />
                  <span>{formatCurrency(selectedEvent.amount)}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-sm text-[var(--text-primary)]">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            {selectedEvent.requestId && (
              <div className="mt-4 pt-3 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => {
                    onEventClick(selectedEvent);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#84cc16] text-white text-sm font-medium hover:brightness-110 transition-colors"
                >
                  View Request Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};