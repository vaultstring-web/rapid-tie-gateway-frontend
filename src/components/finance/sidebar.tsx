// src/components/finance/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Layers,
  PieChart,
  Upload,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/finance' },
  { icon: Wallet, label: 'Ready Disbursements', path: '/finance/disbursements/ready' },
  { icon: Upload, label: 'Bulk Disbursement', path: '/finance/disbursements/bulk' },
  { icon: Layers, label: 'Batch Processing', path: '/finance/disbursements/batches' },
  { icon: PieChart, label: 'Budget Tracking', path: '/finance/budgets' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  const getInitials = () => {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          'flex flex-col h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out',
          // Desktop widths
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile: Full width (w-64) when open, hidden when closed
          'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRightColor: 'var(--border-color)',
          borderRightWidth: 1,
        }}
      >
        <div
          className={cn(
            'p-6 border-b flex items-center h-16 shrink-0',
            isCollapsed ? 'lg:justify-center' : 'lg:justify-between',
            'justify-between'
          )}
          style={{
            borderBottomColor: 'var(--border-color)',
            borderBottomWidth: 1,
          }}
        >
          <div
            className={cn('flex items-center gap-3', isCollapsed && 'lg:justify-center lg:w-full')}
          >
            <img src="/vault.png" alt="Logo" className="w-8 h-8 object-contain" />

            {/* Show text only when NOT collapsed on desktop */}
            {!isCollapsed && (
              <span
                className="text-xl font-bold hidden lg:block"
                style={{ color: 'var(--text-primary)' }}
              >
                VaultString
              </span>
            )}
            {/* On mobile, always show text when open */}
            {isMobileOpen && (
              <span
                className="text-xl font-bold lg:hidden"
                style={{ color: 'var(--text-primary)' }}
              >
                VaultString
              </span>
            )}
          </div>

          {/* Desktop collapse button - only show on desktop */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:block p-1 rounded-lg transition-colors',
              isCollapsed && 'absolute -right-3 shadow-sm'
            )}
            style={{
              backgroundColor: isCollapsed ? 'var(--bg-secondary)' : 'transparent',
              borderColor: isCollapsed ? 'var(--border-color)' : 'transparent',
              borderWidth: isCollapsed ? 1 : 0,
              color: 'var(--text-primary)',
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-[#84cc16]/10 text-[#84cc16]'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                // When collapsed on desktop, center the icon
                isCollapsed && 'lg:justify-center',
                // On mobile, always show left-aligned
                'justify-start'
              )}
              style={{
                color: isActive(item.path) ? '#84cc16' : 'var(--text-primary)',
                backgroundColor: isActive(item.path) ? 'rgba(132, 204, 22, 0.1)' : 'transparent',
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {/* Show label ONLY when NOT collapsed on desktop */}
              {!isCollapsed && (
                <span className="whitespace-nowrap hidden lg:inline">{item.label}</span>
              )}
              {/* On mobile, always show label when sidebar is open */}
              {isMobileOpen && <span className="whitespace-nowrap lg:hidden">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div
          className={cn('p-4 border-t', isCollapsed && 'lg:flex lg:justify-center')}
          style={{
            borderTopColor: 'var(--border-color)',
            borderTopWidth: 1,
          }}
        >
          <Link
            href="/finance/profile"
            onClick={onMobileClose}
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg transition-colors w-full',
              isCollapsed ? 'lg:justify-center' : 'lg:justify-start'
            )}
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
            title={isCollapsed ? `${user.name} - ${user.position}` : undefined}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: '#84cc16', color: 'white' }}>
                {getInitials()}
              </div>
            )}
            {/* Show profile text ONLY when NOT collapsed on desktop */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 hidden lg:block">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user.position}
                </p>
              </div>
            )}
            {/* On mobile, always show text when sidebar is open */}
            {isMobileOpen && (
              <div className="flex-1 min-w-0 lg:hidden">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user.position}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
