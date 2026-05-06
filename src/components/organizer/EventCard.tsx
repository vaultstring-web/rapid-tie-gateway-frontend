'use client';

import Link from 'next/link';
import { Calendar, MapPin, Ticket, Eye, MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';
import { Event, STATUS_CONFIG } from '@/types/organizer/eventManagement';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
  onDuplicate?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export const EventCard = ({ event, onDuplicate, onDelete }: EventCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[event.status];
  const totalSold = event.ticketTiers.reduce((sum, t) => sum + t.sold, 0);
  const totalCapacity = event.ticketTiers.reduce((sum, t) => sum + t.quantity, 0);
  const salesPercentage = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48">
        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${status?.bg} ${status?.color}`}>
            {status?.label}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70">
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-36 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                <Link href={`/organizer/event-management/${event.id}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)]">
                  <Edit size={14} /> Edit
                </Link>
                <button onClick={() => onDuplicate?.(event.id)} className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)]">
                  <Copy size={14} /> Duplicate
                </button>
                <button onClick={() => onDelete?.(event.id)} className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-red-500 hover:bg-red-500/10">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <Link href={`/organizer/event-management/${event.id}`}>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] hover:text-[#84cc16] transition-colors line-clamp-1">
            {event.name}
          </h3>
        </Link>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Calendar size={14} /> {formatDate(event.startDate)}
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <MapPin size={14} /> {event.venue}, {event.city}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Tickets Sold</span>
            <span className="font-medium">{totalSold.toLocaleString()} / {totalCapacity.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
            <div className="h-full bg-[#84cc16] rounded-full transition-all" style={{ width: `${salesPercentage}%` }} />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
          <span className="text-sm text-[var(--text-secondary)]">Revenue</span>
          <span className="text-xl font-bold text-[#84cc16]">{formatCurrency(event.ticketTiers.reduce((sum, t) => sum + t.sold * t.price, 0))}</span>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href={`/organizer/event-management/${event.id}`} className="flex-1 text-center px-4 py-2 rounded-lg bg-[#84cc16]/10 text-[#84cc16] font-medium hover:bg-[#84cc16] hover:text-white transition-all">
            Manage Event
          </Link>
          <Link href={`/events/${event.id}`} target="_blank" className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#84cc16] hover:text-[#84cc16] transition-all">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};