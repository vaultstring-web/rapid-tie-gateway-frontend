'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Calendar, MapPin, DollarSign, Users, MoreVertical, TrendingUp } from 'lucide-react';
import { AdminEvent, EVENT_STATUS_CONFIG, EVENT_CATEGORIES } from '@/types/admin/events';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface EventsTableProps {
  events: AdminEvent[];
  loading?: boolean;
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
  onPublish?: (eventId: string) => void;
  onCancel?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onViewDetails?: (event: AdminEvent) => void;
}

export const EventsTable = ({ 
  events, 
  loading, 
  onApprove, 
  onReject, 
  onPublish, 
  onCancel, 
  onDelete, 
  onViewDetails 
}: EventsTableProps) => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const getStatusConfig = (status: string) => {
    const config = EVENT_STATUS_CONFIG[status as keyof typeof EVENT_STATUS_CONFIG];
    return config || EVENT_STATUS_CONFIG.pending;
  };

  const getCategoryIcon = (category: string) => {
    const cat = EVENT_CATEGORIES.find(c => c.value === category);
    return cat?.icon || '📅';
  };

  const getCategoryColor = (category: string) => {
    const cat = EVENT_CATEGORIES.find(c => c.value === category);
    return cat?.color || '#6b7280';
  };

  if (loading) {
    return React.createElement('div', { className: "space-y-3" },
      [1, 2, 3, 4, 5].map((i) =>
        React.createElement('div', { key: i, className: "rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]" },
          React.createElement('div', { className: "flex gap-3" },
            React.createElement('div', { className: "h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" }),
            React.createElement('div', { className: "flex-1 space-y-2" },
              React.createElement('div', { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" }),
              React.createElement('div', { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" })
            )
          )
        )
      )
    );
  }

  if (events.length === 0) {
    return React.createElement('div', { className: "text-center py-12" },
      React.createElement(CalendarIcon, { size: 48, className: "mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" }),
      React.createElement('h3', { className: "text-lg font-semibold text-[var(--text-primary)] mb-2" }, "No Events Found"),
      React.createElement('p', { className: "text-sm text-[var(--text-secondary)]" }, "No events match your filters")
    );
  }

  return (
    <React.Fragment>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Event</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Organizer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Tickets</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Revenue</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {events.map((event) => {
              const statusConfig = getStatusConfig(event.status);
              const StatusIconComponent = statusConfig.icon;
              const isPending = event.status === 'pending';
              const isApproved = event.status === 'approved';
              const isPublished = event.status === 'published';
              
              return (
                <tr key={event.id} className="hover:bg-[var(--hover-bg)] transition-colors cursor-pointer" onClick={() => onViewDetails?.(event)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${getCategoryColor(event.category)}20` }}>
                        <span>{getCategoryIcon(event.category)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{event.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <MapPin size={10} className="text-[var(--text-secondary)]" />
                          <span className="text-xs text-[var(--text-secondary)]">{event.venue}, {event.city}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{event.organizerName}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{event.organizerEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{formatDateTime(event.startDate)}</p>
                      <p className="text-xs text-[var(--text-secondary)]">to {formatDateTime(event.endDate)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{event.totalSold.toLocaleString()}</p>
                      <p className="text-xs text-[var(--text-secondary)]">/ {event.totalTickets.toLocaleString()}</p>
                      <div className="w-16 h-1 bg-[var(--border-color)] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-[#84cc16] rounded-full" style={{ width: `${(event.totalSold / event.totalTickets) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-bold text-[#84cc16]">{formatCurrency(event.totalRevenue)}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{event.totalViews.toLocaleString()} views</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>{statusConfig.icon}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === event.id ? null : event.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                      </button>
                      {menuOpen === event.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails?.(event);
                              setMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApprove?.(event.id);
                                  setMenuOpen(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-green-600"
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowRejectModal(event.id);
                                  setMenuOpen(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-red-600"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </>
                          )}
                          {isApproved && !isPublished && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPublish?.(event.id);
                                setMenuOpen(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-blue-600"
                            >
                              <TrendingUp size={14} />
                              Publish
                            </button>
                          )}
                          {isPublished && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCancelModal(event.id);
                                setMenuOpen(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-yellow-600"
                            >
                              <XCircle size={14} />
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this event?')) {
                                onDelete?.(event.id);
                              }
                              setMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-red-600"
                          >
                            <Trash2Icon size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(null)}>
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Reject Event</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] mb-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReject?.(showRejectModal);
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(null)}>
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Cancel Event</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] mb-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="Enter cancellation reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onCancel?.(showCancelModal);
                  setShowCancelModal(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Cancel Event
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

// Helper components
const CalendarIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const Trash2Icon = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);