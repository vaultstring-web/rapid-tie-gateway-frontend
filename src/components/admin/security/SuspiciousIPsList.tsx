'use client';

import { useState } from 'react';
import { MapPin, Clock, AlertTriangle, Shield, Ban, CheckCircle, MoreVertical, X } from 'lucide-react';
import { SuspiciousIP } from '@/types/admin/security';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface SuspiciousIPsListProps {
  ips: SuspiciousIP[];
  loading?: boolean;
  onBlock?: (ip: string, reason: string) => void;
  onWhitelist?: (ip: string) => void;
  onUnblock?: (ip: string) => void;
}

export const SuspiciousIPsList = ({ ips, loading, onBlock, onWhitelist, onUnblock }: SuspiciousIPsListProps) => {
  const { theme } = useTheme();
  const [selectedIP, setSelectedIP] = useState<SuspiciousIP | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockingIP, setBlockingIP] = useState<string | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    if (score >= 50) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-green-500 bg-green-100 dark:bg-green-900/30';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked':
        return { label: 'Blocked', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: Ban };
      case 'whitelisted':
        return { label: 'Whitelisted', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle };
      default:
        return { label: 'Active', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: AlertTriangle };
    }
  };

  const handleBlock = () => {
    if (blockingIP && blockReason) {
      onBlock?.(blockingIP, blockReason);
      setShowBlockModal(false);
      setBlockReason('');
      setBlockingIP(null);
      toast.success(`IP ${blockingIP} blocked`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (ips.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Suspicious IPs</h3>
        <p className="text-sm text-[var(--text-secondary)]">No suspicious IP addresses detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ips.map((ip) => {
        const statusConfig = getStatusBadge(ip.status);
        const StatusIcon = statusConfig.icon;
        
        return (
          <div
            key={ip.ip}
            className="rounded-xl p-4 border transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-mono font-semibold text-[var(--text-primary)]">{ip.ip}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                    <StatusIcon size={10} />
                    {statusConfig.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(ip.riskScore)}`}>
                    Risk: {ip.riskScore}%
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{ip.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>{ip.failedAttempts} failed attempts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Last: {formatDateTime(ip.lastAttempt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {ip.status === 'active' && (
                  <>
                    <button
                      onClick={() => {
                        setBlockingIP(ip.ip);
                        setShowBlockModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                    >
                      Block IP
                    </button>
                    <button
                      onClick={() => onWhitelist?.(ip.ip)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                    >
                      Whitelist
                    </button>
                  </>
                )}
                {ip.status === 'blocked' && (
                  <button
                    onClick={() => onUnblock?.(ip.ip)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                  >
                    Unblock
                  </button>
                )}
                <button
                  onClick={() => setSelectedIP(ip)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* IP Details Modal */}
      {selectedIP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedIP(null)}>
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">IP Details</h3>
              <button onClick={() => setSelectedIP(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={18} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">IP Address</label>
                <p className="text-sm font-mono text-[var(--text-primary)] mt-1">{selectedIP.ip}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Location</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{selectedIP.location}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Failed Attempts</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{selectedIP.failedAttempts}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Last Attempt</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{formatDateTime(selectedIP.lastAttempt)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">Attempts by Hour</label>
                <div className="mt-2 space-y-1">
                  {Object.entries(selectedIP.attemptsByHour || {}).map(([hour, count]) => (
                    <div key={hour} className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">{hour}</span>
                      <span className="text-[var(--text-primary)] font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block IP Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Block IP Address</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Are you sure you want to block <span className="font-mono font-semibold">{blockingIP}</span>?
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Reason for blocking (optional)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] mb-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason('');
                  setBlockingIP(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Block IP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};