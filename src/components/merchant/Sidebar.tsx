'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  ArrowLeftRight,
  Link as LinkIcon,
  RotateCcw,
  Settings,
  Users,
  Key,
  Webhook,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/merchant' },
  { icon: BarChart3, label: 'Analytics', path: '/merchant/analytics' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/merchant/transactions' },
  { icon: LinkIcon, label: 'Payment Links', path: '/merchant/payment-links' },
  { icon: RotateCcw, label: 'Refunds', path: '/merchant/refunds' },
];

const settingItems = [
  { icon: Key, label: 'API Keys', path: '/merchant/settings/api-keys' },
  { icon: Webhook, label: 'Webhooks', path: '/merchant/settings/webhooks' },
  { icon: CreditCard, label: 'Checkout', path: '/merchant/settings/checkout' },
  { icon: Users, label: 'Team', path: '/merchant/settings/team' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/merchant' && pathname === '/merchant') return true;
    if (path !== '/merchant' && pathname?.startsWith(path)) return true;
    return false;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRightColor: 'var(--border-color)',
        borderRightWidth: 1,
      }}
    >
      <div
        className={cn('p-6 flex items-center', isCollapsed ? 'justify-center' : 'justify-between')}
        style={{ borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
      >
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <img src="/vault.png" alt="VaultString Logo" className="w-8 h-8 object-contain" />
          {!isCollapsed && (
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              VaultString
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1 rounded-lg transition-colors',
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
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div
          className={cn(
            'text-xs font-semibold uppercase tracking-wider mb-4 px-2',
            isCollapsed && 'text-center text-[10px]'
          )}
          style={{ color: 'var(--text-secondary)' }}
        >
          {!isCollapsed ? 'Main Menu' : '•••'}
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.path) ? 'bg-[#84cc16]/10 text-[#84cc16]' : 'hover:transition-colors',
              isCollapsed && 'justify-center'
            )}
            style={!isActive(item.path) ? { color: 'var(--text-secondary)' } : {}}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!isCollapsed && item.label}
          </Link>
        ))}

        <div
          className={cn(
            'text-xs font-semibold uppercase tracking-wider mt-8 mb-4 px-2',
            isCollapsed && 'text-center text-[10px]'
          )}
          style={{ color: 'var(--text-secondary)' }}
        >
          {!isCollapsed ? 'Settings' : '⚙️'}
        </div>
        {settingItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.path) ? 'bg-[#84cc16]/10 text-[#84cc16]' : 'hover:transition-colors',
              isCollapsed && 'justify-center'
            )}
            style={!isActive(item.path) ? { color: 'var(--text-secondary)' } : {}}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!isCollapsed && item.label}
          </Link>
        ))}
      </nav>

      {/* Profile Section Link at bottom */}
      <div
        className={cn('p-4', isCollapsed && 'flex justify-center')}
        style={{ borderTopColor: 'var(--border-color)', borderTopWidth: 1 }}
      >
        <Link
          href="/merchant/settings/profile"
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg transition-colors w-full',
            isCollapsed && 'justify-center'
          )}
          style={{ backgroundColor: 'var(--hover-bg)' }}
        >
          <img
            src="https://i.pravatar.cc/150?u=merchant"
            alt="Merchant"
            className="w-8 h-8 rounded-full shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                Leticia K.
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                leticia@merchant.com
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
