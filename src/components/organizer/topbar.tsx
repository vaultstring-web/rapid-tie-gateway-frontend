// components/OrganizerTopbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Sun, Moon, User as UserIcon } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface TopbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function OrganizerTopbar({ theme, toggleTheme }: TopbarProps) {
  const { user } = useUser();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-end gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-blue-600" />
          )}
        </button>
        
        {/* Notifications */}
        <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#84cc16] rounded-full border-2 border-[var(--bg-primary)]"></span>
        </button>

        {/* Profile Link Section */}
        <Link 
          href="/organizer/profile" 
          className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)] hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{user.name}</p>
            <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center border-2 border-[#84cc16]/20 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}