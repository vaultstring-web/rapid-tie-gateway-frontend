'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Ticket,
  Users,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Sparkles,
  Eye,
  ArrowLeft,
} from 'lucide-react';

interface EventManagementSidebarProps {
  eventId: string;
  eventName?: string;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function EventManagementSidebar({ 
  eventId, 
  eventName, 
  isCollapsed, 
  setIsCollapsed 
}: EventManagementSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Event Details', 
      href: `/organizer/events/${eventId}`, 
      icon: Calendar,
      description: 'Edit event information'
    },
    { 
      name: 'Ticket Tiers', 
      href: `/organizer/events/${eventId}/tiers`, 
      icon: Ticket,
      description: 'Manage ticket types and pricing'
    },
    { 
      name: 'Attendees', 
      href: `/organizer/events/${eventId}/attendees`, 
      icon: Users,
      description: 'View and manage attendees'
    },
    { 
      name: 'Check-in', 
      href: `/organizer/events/${eventId}/checkin`, 
      icon: CheckCircle,
      description: 'Scan tickets and check-in attendees'
    },
    { 
      name: 'Sales', 
      href: `/organizer/events/${eventId}/sales`, 
      icon: BarChart3,
      description: 'View sales analytics'
    },
    { 
      name: 'Messaging', 
      href: `/organizer/events/${eventId}/communications`, 
      icon: MessageSquare,
      description: 'Send bulk messages'
    },
    { 
      name: 'QR Codes', 
      href: `/organizer/events/${eventId}/qrcodes`, 
      icon: Sparkles,
      description: 'Manage QR codes'
    },
    { 
      name: 'Preview Event', 
      href: `/events/${eventId}`, 
      icon: Eye,
      description: 'View public event page',
      targetBlank: true
    },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <aside
      className={`sticky top-0 h-screen transition-all duration-300 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`h-16 flex items-center px-4 border-b border-[var(--border-color)] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Link href="/organizer/events" className="p-1 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
              <ArrowLeft size={16} className="text-[#84cc16]" />
            </Link>
            <div>
              <p className="font-bold text-sm text-[var(--text-primary)]">Event Management</p>
              {eventName && (
                <p className="text-[10px] text-[var(--text-secondary)] truncate max-w-[150px]">{eventName}</p>
              )}
            </div>
          </div>
        )}
        {isCollapsed && (
          <Link href="/organizer/events" className="p-1 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
            <ArrowLeft size={16} className="text-[#84cc16]" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg text-[#84cc16] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Event ID Display */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-[var(--border-color)]">
          <div className="text-xs font-medium text-[#84cc16] bg-[#84cc16]/10 px-2 py-1 rounded-lg inline-block">
            Event ID: {eventId.slice(0, 8)}...
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-120px)]">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              target={item.targetBlank ? '_blank' : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                active
                  ? 'bg-[#84cc16] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-primary)]'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={!isCollapsed ? item.description : item.name}
            >
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm block">{item.name}</span>
                  <span className="text-[10px] block truncate" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Back to Events */}
      <div className="absolute bottom-0 w-full p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <Link
          href="/organizer/events"
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-primary)] transition-colors ${
            !isCollapsed ? 'w-full' : 'justify-center'
          }`}
        >
          <ArrowLeft size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Back to My Events</span>}
        </Link>
      </div>
    </aside>
  );
}

// Helper component for Chevron icons
const ChevronLeft = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);