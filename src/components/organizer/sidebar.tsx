/* 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  Ticket,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Search,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', href: '/organizer', icon: LayoutDashboard },
  { name: 'Discover Events', href: '/events', icon: Search },
  { name: 'My Events', href: '/organizer/events', icon: Calendar },
  { name: 'Create Event', href: '/organizer/events/create', icon: PlusCircle },
  { name: 'Analytics', href: '/organizer/analytics', icon: BarChart3 },
  { name: 'Attendees', href: '/organizer/attendees', icon: Users },
  { name: 'Ticket Tiers', href: '/organizer/ticket-tiers', icon: Ticket },
  { name: 'Settings', href: '/organizer/settings', icon: Settings },
];

export function OrganizerSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/organizer') return pathname === '/organizer';
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`sticky top-0 h-screen transition-all duration-300 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className={`h-16 flex items-center px-4 border-b border-[var(--border-color)] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <img src="/vault.png" alt="VaultString" className="w-8 h-8 object-contain" />
            <span className="font-bold text-sm text-[var(--text-primary)]">VaultString</span>
          </div>
        )}
        {isCollapsed && (
          <img src="/vault.png" alt="VaultString" className="w-8 h-8 object-contain" />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg text-[#84cc16] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                active
                  ? 'bg-[#84cc16] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-primary)]'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`absolute bottom-0 w-full p-4 border-t border-[var(--border-color)] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors ${
            !isCollapsed ? 'w-full' : ''
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
} */