'use client';

import { Bell, Sun, Moon, User } from 'lucide-react';

interface TopbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function EmployeeTopbar({ theme, toggleTheme }: TopbarProps) {
  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 flex items-center justify-end gap-4 sticky top-0 z-10">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
      >
        {theme === 'dark' ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-blue-600" />
        )}
      </button>

      {/* Notifications */}
      <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors relative">
        <Bell size={18} className="text-[var(--text-secondary)]" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Profile */}
      <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)]">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-[var(--text-primary)]">John Doe</p>
          <p className="text-xs text-[var(--text-secondary)]">Employee</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 flex items-center justify-center">
          <User size={18} className="text-[#84cc16]" />
        </div>
      </div>
    </header>
  );
}