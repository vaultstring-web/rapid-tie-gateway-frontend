'use client';

import { X, Calendar, MapPin, User, Mail, Phone, DollarSign, Ticket, Eye, TrendingUp } from 'lucide-react';
import { AdminEvent, EVENT_STATUS_CONFIG, EVENT_CATEGORIES } from '@/types/admin/events';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface EventDetailModalProps {
  event: AdminEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailModal = ({ event, isOpen, onClose }: EventDetailModalProps) => {
  const { theme } = useTheme();

  if (!isOpen || !event) return null;

  const statusConfig = EVENT_STATUS_CONFIG[event.status as keyof typeof EVENT_STATUS_CONFIG];
  const categoryConfig = EVENT_CATEGORIES.find(c => c.value === event.category);
  const salesPercentage = (event.totalSold / event.totalTickets) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryConfig?.icon}</span>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Event Details</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">{event.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">ID: {event.id}</span>
                </div>
              </div>
              <Link
                href={`/events/${event.id}`}
                target="_blank"
                className="text-[#84cc16] hover:underline text-sm"
              >
                View Public Page →
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Ticket size={14} />
                Tickets Sold
              </div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{event.totalSold.toLocaleString()} / {event.totalTickets.toLocaleString()}</p>
              <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#84cc16] rounded-full" style={{ width: `${salesPercentage}%` }} />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <DollarSign size={14} />
                Revenue
              </div>
              <p className="text-xl font-bold text-[#84cc16]">{formatCurrency(event.totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Eye size={14} />
                Views
              </div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{event.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <TrendingUp size={14} />
                Avg. Ticket
              </div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(event.totalRevenue / event.totalSold)}</p>
            </div>
          </div>

          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Event Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">{formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">{event.venue}, {event.city}, {event.country}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-[var(--text-secondary)]">{event.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Organizer Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">{event.organizerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">{event.organizerEmail}</span>
                </div>
                {event.organizerPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-primary)]">{event.organizerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Tiers */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Ticket Tiers</h3>
            <div className="space-y-2">
              {event.ticketTiers.map((tier) => (
                <div key={tier.id} className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-primary)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{tier.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Sold: {tier.sold} / {tier.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#84cc16]">{formatCurrency(tier.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Approval History */}
          {event.approvalNotes && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Approval Notes</h3>
              <p className="text-sm text-[var(--text-secondary)]">{event.approvalNotes}</p>
              {event.approvedBy && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Approved by: {event.approvedBy} at {formatDateTime(event.approvedAt!)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};