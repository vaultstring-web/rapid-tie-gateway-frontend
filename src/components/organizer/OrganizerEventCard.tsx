'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, Eye, MoreVertical, Edit, Copy, Trash2, CheckCircle } from 'lucide-react';
import { OrganizerEvent } from '@/types/organizer/dashboard';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

const EVENT_STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-500', textColor: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  published: { label: 'Published', color: 'bg-green-500', textColor: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  completed: { label: 'Completed', color: 'bg-blue-500', textColor: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
};

interface OrganizerEventCardProps {
  event: OrganizerEvent;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (eventId: string) => void;
  onPublish?: (eventId: string) => void;
}

export const OrganizerEventCard = ({ event, onDelete, onDuplicate, onPublish }: OrganizerEventCardProps) => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const statusConfig = EVENT_STATUS_CONFIG[event.status as keyof typeof EVENT_STATUS_CONFIG] || EVENT_STATUS_CONFIG.draft;

  const totalSold = event.ticketTiers?.reduce((sum, tier) => sum + (tier.sold || 0), 0) || 0;
  const totalCapacity = event.ticketTiers?.reduce((sum, tier) => sum + (tier.quantity || 0), 0) || 0;
  const attendanceRate = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      MERCHANT: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      ORGANIZER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      EMPLOYEE: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      APPROVER: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      FINANCE_OFFICER: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      PUBLIC: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    };
    return colors[role] || colors.PUBLIC;
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event.id);
    }
  };

  return (
    <div
      className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={event.imageUrl || '/images/event-placeholder.jpg'}
          alt={event.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <MoreVertical size={14} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            className="absolute top-10 right-2 z-10 w-36 rounded-lg shadow-lg border py-1"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
            onMouseLeave={() => setShowMenu(false)}
          >
            <Link
              href={`/organizer/events/${event.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text-primary)' }}
            >
              <Edit size={14} />
              Edit
            </Link>
            <button
              onClick={() => onDuplicate?.(event.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text-primary)' }}
            >
              <Copy size={14} />
              Duplicate
            </button>
            {event.status === 'draft' && (
              <button
                onClick={() => onPublish?.(event.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--text-primary)' }}
              >
                <CheckCircle size={14} />
                Publish
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <Link href={`/organizer/events/${event.id}`}>
          <h3 className="text-lg font-semibold line-clamp-1 hover:text-primary-green-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
            {event.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Calendar size={14} />
          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <MapPin size={14} />
          <span className="truncate">{event.venue}, {event.city}</span>
        </div>

        {/* Ticket Sales Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1">
              <Ticket size={12} />
              {totalSold} / {totalCapacity} sold
            </span>
            <span>{Math.round(attendanceRate)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
            <div
              className="h-full rounded-full bg-primary-green-500 transition-all"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Revenue */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Revenue:</span>
          <span className="text-lg font-bold text-primary-green-500">
            {formatCurrency(event.ticketTiers?.reduce((sum, t) => sum + ((t.price || 0) * (t.sold || 0)), 0) || 0)}
          </span>
        </div>

        {/* Visibility Metrics */}
        {event.visibilityMetrics && (
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-1 mb-2">
              <Eye size={12} className="text-primary-green-500" />
              <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Views by Role</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(event.visibilityMetrics).filter(([key]) => key !== 'total').map(([role, count]) => (
                count > 0 && (
                  <span key={role} className={`px-1.5 py-0.5 rounded-full text-[10px] ${getRoleColor(role)}`}>
                    {role}: {count}
                  </span>
                )
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Total views: {event.visibilityMetrics.total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};