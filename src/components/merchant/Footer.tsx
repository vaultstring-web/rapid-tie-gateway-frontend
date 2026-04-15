"use client";

import { useState } from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export default function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        borderBottomWidth: 1,
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search transactions, links, or events..."
              className="w-full pl-10 h-10 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#84cc16] transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:transition-colors relative"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
        >
          <Bell size={20} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2"
            style={{ backgroundColor: 'rgb(239, 68, 68)' }}
          ></span>
        </button>

        <ThemeToggle />

        <div className="h-8 w-px" style={{ backgroundColor: 'var(--border-color)' }}></div>

        <button
          className="flex items-center gap-2 text-sm font-medium hover:transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="hidden sm:inline">English</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="absolute top-16 left-0 right-0 border-b p-4 lg:hidden transition-colors"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 h-10 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#84cc16] transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}