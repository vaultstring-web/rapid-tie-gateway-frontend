'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import { useTheme } from '@/context/ThemeContext';

export const UnreadBadge = () => {
  const { theme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to load unread count:', error);
      }
    };

    loadUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" className="relative">
      <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white min-w-[16px] text-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};