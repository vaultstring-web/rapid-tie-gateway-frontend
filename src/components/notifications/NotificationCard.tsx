'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, X, Check, Calendar, DollarSign, FileText, Users, MessageCircle, AlertCircle } from 'lucide-react';
import { Notification, NOTIFICATION_TYPE_CONFIG } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard = ({ notification, onMarkAsRead, onDelete }: NotificationCardProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const config = NOTIFICATION_TYPE_CONFIG[notification.type];

  const getIcon = () => {
    switch (notification.type) {
      case 'payment':
        return <DollarSign size={18} className={config.color} />;
      case 'event':
        return <Calendar size={18} className={config.color} />;
      case 'dsa':
        return <FileText size={18} className={config.color} />;
      case 'connection':
        return <Users size={18} className={config.color} />;
      case 'message':
        return <MessageCircle size={18} className={config.color} />;
      default:
        return <Bell size={18} className={config.color} />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`group relative rounded-xl p-4 transition-all duration-200 ${
        !notification.read ? 'border-l-4 border-l-primary-green-500' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Avatar / Icon */}
        {notification.sender ? (
          <Image
            src={notification.sender.avatar || '/images/default-avatar.png'}
            alt={notification.sender.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--hover-bg)' }}
          >
            {getIcon()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {notification.sender && (
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {notification.sender.name}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                  {config.label}
                </span>
                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-primary-green-500" />
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                {notification.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {notification.message}
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  title="Mark as read"
                >
                  <Check size={14} className="text-green-500" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title="Delete"
              >
                <X size={14} className="text-red-500" />
              </button>
            </div>
          </div>

          {/* Action Button */}
          {notification.data?.buttonText && notification.data?.actionUrl && (
            <Link
              href={notification.data.actionUrl}
              className="inline-block mt-3 text-xs font-medium text-primary-green-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {notification.data.buttonText} →
            </Link>
          )}
        </div>
      </div>

      {/* Event Card Preview (if event notification) */}
      {notification.type === 'event' && notification.data?.eventId && (
        <div
          className="mt-3 p-3 rounded-lg border-l-4 border-l-purple-500"
          style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-purple-500" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              Related Event
            </span>
          </div>
          <Link
            href={`/events/${notification.data.eventId}`}
            className="text-sm text-primary-green-500 hover:underline mt-1 inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            View Event Details →
          </Link>
        </div>
      )}

      {/* Payment Card Preview */}
      {notification.type === 'payment' && notification.data?.amount && (
        <div
          className="mt-3 p-3 rounded-lg border-l-4 border-l-green-500"
          style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-green-500" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              Amount: {notification.data.currency || 'MWK'} {notification.data.amount.toLocaleString()}
            </span>
          </div>
          {notification.data?.transactionId && (
            <Link
              href={`/transactions/${notification.data.transactionId}`}
              className="text-sm text-primary-green-500 hover:underline mt-1 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              View Transaction →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};