'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface ApproverSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function ApproverSidebar({ isCollapsed, setIsCollapsed }: ApproverSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/approver', icon: LayoutDashboard },
    { name: 'Pending Approvals', href: '/approver/pending', icon: Clock },
    { name: 'Approved', href: '/approver/approved', icon: CheckCircle },
    { name: 'Rejected', href: '/approver/rejected', icon: XCircle },
    { name: 'Team', href: '/approver/team', icon: Users },
    { name: 'Analytics', href: '/approver/analytics', icon: TrendingUp },
    { name: 'Calendar', href: '/approver/calendar', icon: Calendar },
    { name: 'Settings', href: '/approver/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('rapid_tie_session');
      
      document.cookie.split(';').forEach(function(c) {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const isActive = (href: string) => {
    if (href === '/approver') return pathname === '/approver';
    return pathname?.startsWith(href) && href !== '/approver';
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
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-120px)]">
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

      {/* Footer - Logout Button */}
      <div className={`absolute bottom-0 w-full p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors group ${
            !isCollapsed ? 'w-full' : ''
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}