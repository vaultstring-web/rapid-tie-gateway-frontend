"use client";

import { useState } from 'react';
import { Bell, Sun, Moon, ChevronDown, Search } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors border-b bg-[var(--bg-secondary)] border-[var(--border-color)]">
      
      {/* Search Section */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border transition-colors outline-none focus:ring-2 focus:ring-[#84cc16]/50 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          />
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md transition-colors text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 rounded-md transition-colors text-[var(--text-primary)] hover:bg-[var(--bg-primary)]">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)]"></span>
        </button>

        {/* User Dropdown Profile */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1 px-2 rounded-md transition-colors hover:bg-[var(--bg-primary)]"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-[#84cc16]/20 text-[#84cc16] font-bold text-sm">
              {user?.avatar ? <img src={user.avatar} alt="avatar" /> : getUserInitials()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-none text-[var(--text-primary)]">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {user?.role || 'Merchant'}
              </p>
            </div>
            <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border shadow-lg z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]">
              <div className="p-3 border-b border-[var(--border-color)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">My Account</p>
              </div>
              <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[#84cc16]/10 transition-colors">Profile</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[#84cc16]/10 transition-colors">Settings</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[#84cc16]/10 transition-colors">Billing</button>
                <div className="h-px bg-[var(--border-color)] my-1"></div>
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}