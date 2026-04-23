'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Ticket,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bell,
  Shield,
  Building2,
} from 'lucide-react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Merchants', href: '/admin/merchants', icon: Users },
  { name: 'System Health', href: '/admin/health', icon: Activity },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Transactions', href: '/admin/transactions', icon: Ticket },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

// Inner component that uses useTheme
function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get theme from context (now safely inside ThemeProvider)
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      document.cookie.split(';').forEach(function(c) {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      toast.success('Logged out successfully');
      setTimeout(() => router.push('/login'), 500);
    } catch (error) {
      toast.error('Failed to logout');
      setIsLoggingOut(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen transition-all duration-300 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo Section */}
        <div className={`h-16 flex items-center px-4 border-b border-[var(--border-color)] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#84cc16] flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-bold text-sm text-[var(--text-primary)]">Admin Panel</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#84cc16] flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg text-[#84cc16] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-120px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-[#84cc16] text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-[#84cc16] hover:bg-[var(--bg-primary)]'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors ${
              !isCollapsed ? 'w-full' : 'justify-center'
            }`}
          >
            {isLoggingOut ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={20} className="shrink-0" />
            )}
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 flex items-center justify-end gap-4 sticky top-0 z-10">
          <ThemeToggle />
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors relative">
              <Bell size={18} className="text-[var(--text-secondary)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)]">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)]">Admin User</p>
              <p className="text-xs text-[var(--text-secondary)]">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 flex items-center justify-center">
              <Shield size={18} className="text-[#84cc16]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Main layout export with ThemeProvider at the root
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}