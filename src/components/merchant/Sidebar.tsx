'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  TrendingUp,
  Calendar,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/merchant' },
  { icon: BarChart3, label: 'Analytics', path: '/merchant/analytics' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/merchant/transactions' },
  { icon: LinkIcon, label: 'Payment Links', path: '/merchant/payment-links' },
  { icon: RotateCcw, label: 'Refunds', path: '/merchant/refunds' },
  { icon: TrendingUp, label: 'Event Analytics', path: '/analytics/events' },
  { icon: Users, label: 'Networking', path: '/events/networking' },
  { icon: Calendar, label: 'Discover Events', path: '/events' },
  { icon: Sparkles, label: 'Recommendations', path: '/events/recommended' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
];

const settingItems = [
  { icon: Key, label: 'API Keys', path: '/merchant/settings/api-keys' },
  { icon: Webhook, label: 'Webhooks', path: '/merchant/settings/webhooks' },
  { icon: CreditCard, label: 'Checkout', path: '/merchant/settings/checkout' },
  { icon: Users, label: 'Team', path: '/merchant/settings/team' },
];

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('rapid_tie_session');
      
      // Clear cookies
      document.cookie.split(';').forEach(function(c) {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      
      toast.success('Logged out successfully');
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      setIsLoggingOut(false);
    }
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
      {/* Logo Section */}
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

      {/* Navigation */}
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

      {/* Logout Button - At the bottom */}
      <div
        className={cn('p-4 border-t', isCollapsed && 'flex justify-center')}
        style={{ borderTopColor: 'var(--border-color)' }}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-red-500 hover:bg-red-500/10',
            isCollapsed && 'justify-center'
          )}
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut size={18} className="shrink-0" />
          )}
          {!isCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}