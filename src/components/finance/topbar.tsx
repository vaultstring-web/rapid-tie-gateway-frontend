'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useUser();

  const getInitials = () => {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-20 transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        borderBottomWidth: 1,
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden transition-colors"
          style={{ color: 'var(--text-primary)' }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full relative transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <ThemeToggle />

        <div
          className="h-8 w-px mx-2 transition-colors"
          style={{ backgroundColor: 'var(--border-color)' }}
        ></div>

        <Link
          href="/finance/profile"
          className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80"
          style={{ color: 'var(--text-primary)' }}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.name}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-secondary)' }}
            >
              {user.position}
            </p>
          </div>
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#84cc16', color: 'white' }}>
              {getInitials()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
