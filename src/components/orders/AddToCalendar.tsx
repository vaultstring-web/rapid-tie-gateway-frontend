'use client';

import { useState } from 'react';
import { CalendarPlus, Check, ChevronDown } from 'lucide-react';
import { CalendarEvent } from '@/types/orders/orderConfirmation';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface AddToCalendarProps {
  event: CalendarEvent;
  onAdd: () => Promise<void>;
}

const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const start = new Date(event.startDate).toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(event.endDate).toISOString().replace(/-|:|\.\d+/g, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
};

const generateOutlookCalendarUrl = (event: CalendarEvent): string => {
  const start = new Date(event.startDate).toISOString();
  const end = new Date(event.endDate).toISOString();
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
};

const generateICalData = (event: CalendarEvent): string => {
  const start = new Date(event.startDate).toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(event.endDate).toISOString().replace(/-|:|\.\d+/g, '');
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rapid Tie//Event Calendar//EN
BEGIN:VEVENT
UID:${Date.now()}@rapidtie.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
};

export const AddToCalendar = ({ event, onAdd }: AddToCalendarProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCalendar = async (calendarType: string) => {
    setAdding(true);
    try {
      await onAdd();
      
      let url = '';
      switch (calendarType) {
        case 'google':
          url = generateGoogleCalendarUrl(event);
          window.open(url, '_blank');
          break;
        case 'outlook':
          url = generateOutlookCalendarUrl(event);
          window.open(url, '_blank');
          break;
        case 'apple':
          const iCalData = generateICalData(event);
          const blob = new Blob([iCalData], { type: 'text/calendar' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${event.title.replace(/\s/g, '_')}.ics`;
          link.click();
          URL.revokeObjectURL(link.href);
          break;
      }
      toast.success('Event added to calendar');
    } catch (error) {
      toast.error('Failed to add to calendar');
    } finally {
      setAdding(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={adding}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        {adding ? (
          <div className="w-4 h-4 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <CalendarPlus size={16} />
        )}
        Add to Calendar
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border z-50 overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <button
              onClick={() => handleAddToCalendar('google')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              📅 Google Calendar
            </button>
            <button
              onClick={() => handleAddToCalendar('outlook')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              📧 Outlook Calendar
            </button>
            <button
              onClick={() => handleAddToCalendar('apple')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              📱 Apple Calendar (.ics)
            </button>
          </div>
        </>
      )}
    </div>
  );
};