'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { 
  LayoutDashboard, Search, Calendar, PlusCircle, 
  Users, CheckCircle, BarChart3, ChevronLeft, 
  ChevronRight, LogOut, Ticket
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function OrganizerSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  
  const eventId = params?.id;

  const navItems = [
    { name: 'Dashboard', href: '/organizer', icon: LayoutDashboard },
    { name: 'Discover Events', href: '/events', icon: Search },
    { name: 'My Events', href: '/events/id', icon: Calendar },
    { name: 'Create Event', href: '/organizer/events/create', icon: PlusCircle },
    { 
      name: 'Ticket Tiers', 
      href: eventId ? `/organizer/events/:id/tiers` : '/organizer/events/:id/tiers', 
      icon: Ticket 
    },
    { 
      name: 'Attendee Lists', 
      href: eventId ? `/organizer/events/:id/attendees` : '/organizer/events/:id/attendees', 
      icon: Users 
    },
    { 
      name: 'Check-in Manager', 
      href: eventId ? `/organizer/events/:id/checkin` : '/organizer/events/:id/checkin', 
      icon: CheckCircle 
    },
    { 
      name: 'Sales & Revenue', 
      href: eventId ? `/organizer/events/:id/sales` : '/organizer/events/:id/sales', 
      icon: BarChart3 
    },

    { 
      name: 'Ticket Purchase', 
      href: eventId ? `/organizer/events/:id/purchase` : '/organizer/events/:id/purchase', 
      icon: BarChart3 
    },
  ];

  return (
    <aside 
      className={`sticky top-0 h-screen transition-all duration-300 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`h-16 flex items-center px-4 border-b border-[var(--border-color)] ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-lime-500/20">
              <img src="/vault.png" alt="V" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-black text-sm uppercase tracking-tighter text-[var(--text-primary)]">
              VaultString
            </span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-lime-500/20">
            <img src="/vault.png" alt="V" className="w-5 h-5 object-contain" />
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg text-[#84cc16] transition-colors shrink-0"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-[#84cc16] text-white shadow-lg shadow-lime-500/20' 
                  : 'text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-primary)]'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon 
                size={20} 
                className={`shrink-0 ${isActive ? 'text-white' : 'group-hover:text-[#84cc16]'}`} 
              />
              {!isCollapsed && (
                <span className="font-black text-[10px] uppercase tracking-[0.15em] whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`absolute bottom-0 w-full p-4 border-t border-[var(--border-color)] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors group ${!isCollapsed ? 'w-full' : ''}`}>
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </aside>
  );
}