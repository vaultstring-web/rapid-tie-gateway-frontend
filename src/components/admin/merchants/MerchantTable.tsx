'use client';

import { useState } from 'react';
import { 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Power, 
  Trash2,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';
import { Merchant, MERCHANT_STATUS_CONFIG } from '@/types/admin/merchants';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface MerchantTableProps {
  merchants: Merchant[];
  loading?: boolean;
  onApprove?: (merchantId: string) => void;
  onReject?: (merchantId: string) => void;
  onSuspend?: (merchantId: string) => void;
  onActivate?: (merchantId: string) => void;
  onDelete?: (merchantId: string) => void;
}

export const MerchantTable = ({
  merchants,
  loading,
  onApprove,
  onReject,
  onSuspend,
  onActivate,
  onDelete,
}: MerchantTableProps) => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Merchants Found</h3>
        <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Business</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Events</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Revenue</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {merchants.map((merchant) => {
              const statusConfig = MERCHANT_STATUS_CONFIG[merchant.status];
              const isPending = merchant.status === 'pending';
              const isSuspended = merchant.status === 'suspended';
              
              return (
                <tr key={merchant.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#84cc16]/10 flex items-center justify-center">
                        {merchant.logo ? (
                          <img src={merchant.logo} alt={merchant.businessName} className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <Building2 size={18} className="text-[#84cc16]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{merchant.businessName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{merchant.businessType.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[var(--text-primary)]">{merchant.firstName} {merchant.lastName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={12} className="text-[var(--text-secondary)]" />
                      <span className="text-xs text-[var(--text-secondary)]">{merchant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Phone size={12} className="text-[var(--text-secondary)]" />
                      <span className="text-xs text-[var(--text-secondary)]">{merchant.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                      <MapPin size={12} />
                      <span>{merchant.city}, {merchant.country}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Joined: {formatDate(merchant.joinedAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      <span>{statusConfig.icon}</span>
                      {statusConfig.label}
                    </span>
                    {isPending && (
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => onApprove?.(merchant.id)}
                          className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setShowRejectModal(merchant.id)}
                          className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar size={12} className="text-[#84cc16]" />
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{merchant.eventsSponsored}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign size={12} className="text-[#84cc16]" />
                      <span className="text-sm font-semibold text-[#84cc16]">{formatCurrency(merchant.totalRevenue)}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{merchant.totalTransactions} transactions</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === merchant.id ? null : merchant.id)}
                        className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                      >
                        <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                      </button>
                      {menuOpen === merchant.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 overflow-hidden">
                          <Link
                            href={`/admin/merchants/${merchant.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] text-[var(--text-primary)]"
                            onClick={() => setMenuOpen(null)}
                          >
                            <Eye size={14} />
                            View Details
                          </Link>
                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  onApprove?.(merchant.id);
                                  setMenuOpen(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-green-600"
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setShowRejectModal(merchant.id);
                                  setMenuOpen(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-red-600"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </>
                          )}
                          {!isPending && !isSuspended && (
                            <button
                              onClick={() => {
                                setShowSuspendModal(merchant.id);
                                setMenuOpen(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-yellow-600"
                            >
                              <AlertCircle size={14} />
                              Suspend
                            </button>
                          )}
                          {isSuspended && (
                            <button
                              onClick={() => {
                                onActivate?.(merchant.id);
                                setMenuOpen(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-green-600"
                            >
                              <Power size={14} />
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this merchant?')) {
                                onDelete?.(merchant.id);
                              }
                              setMenuOpen(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-[var(--hover-bg)] text-red-600"
                          >
                            <Trash2 size={14} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Reject Merchant</h3>
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

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Suspend Merchant</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Please provide a reason for suspension:</p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] mb-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="Enter suspension reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuspendModal(null);
                  setSuspendReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSuspend?.(showSuspendModal);
                  setShowSuspendModal(null);
                  setSuspendReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};