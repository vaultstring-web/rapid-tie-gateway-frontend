'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  Ticket,
  BarChart3,
  LogOut,
  Settings,
  Search,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function OrganizerSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  // Main navigation items (always visible)
  const mainNavItems = [
    { name: 'Dashboard', href: '/organizer', icon: LayoutDashboard },
    { name: 'Discover Events', href: '/events', icon: Search },
    { name: 'My Events', href: '/organizer/events', icon: Calendar },
    { name: 'Event Management', href: '/organizer/event-management', icon: Calendar },
    { name: 'Create Event', href: '/organizer/events/create', icon: PlusCircle },
    { name: 'Analytics', href: '/organizer/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/organizer/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/organizer') return pathname === '/organizer';
    if (href === '/organizer/events') return pathname === '/organizer/events';
    if (href === '/organizer/events/create') return pathname === '/organizer/events/create';
    if (href === '/organizer/event-management') return pathname === '/organizer/event-management';
    return pathname?.startsWith(href);
  };

  // Custom chevron icons
  const ChevronLeftIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const ChevronRightIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

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
          {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-120px)]">
        {mainNavItems.map((item) => {
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

      {/* Footer - Logout */}
      <div className={`absolute bottom-0 w-full p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] ${isCollapsed ? 'flex justify-center' : ''}`}>
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
}