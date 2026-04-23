'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Mail, Smartphone, RefreshCw, CheckCircle, XCircle, Clock, Eye, EyeOff } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Ticket, ROLE_QR_CONFIGS } from '@/types/events/qrCodeManagement';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface QRCodeGridProps {
  tickets: Ticket[];
  eventName: string;
  onRegenerateQR: (ticketId: string) => Promise<void>;
  onResendTicket: (ticketId: string, method: 'email' | 'sms') => Promise<void>;
  loading?: boolean;
}

export const QRCodeGrid = ({ tickets, eventName, onRegenerateQR, onResendTicket, loading }: QRCodeGridProps) => {
  const { theme } = useTheme();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [resending, setResending] = useState<{ id: string; method: 'email' | 'sms' } | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'used':
        return <Clock size={14} className="text-blue-500" />;
      case 'expired':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <Clock size={14} className="text-yellow-500" />;
    }
  };

  const getDeliveryIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle size={12} className="text-green-500" />;
      case 'failed':
        return <XCircle size={12} className="text-red-500" />;
      default:
        return <Clock size={12} className="text-yellow-500" />;
    }
  };

  const getRoleConfig = (role?: string) => {
    if (!role) return ROLE_QR_CONFIGS.find(r => r.role === 'PUBLIC');
    return ROLE_QR_CONFIGS.find(r => r.role === role) || ROLE_QR_CONFIGS.find(r => r.role === 'PUBLIC');
  };

  const handleRegenerate = async (ticketId: string) => {
    setRegenerating(ticketId);
    await onRegenerateQR(ticketId);
    setRegenerating(null);
  };

  const handleResend = async (ticketId: string, method: 'email' | 'sms') => {
    setResending({ id: ticketId, method });
    await onResendTicket(ticketId, method);
    setResending(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <EyeOff size={32} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          No tickets found
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No tickets match your current filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => {
        const roleConfig = getRoleConfig(ticket.role);
        const isExpanded = expandedTicket === ticket.id;
        
        return (
          <div
            key={ticket.id}
            className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Ticket Header */}
            <div
              className="p-3 border-b flex justify-between items-center"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {ticket.ticketNumber}
                </span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(ticket.status)}
                  <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* QR Code */}
            <div className="p-4 flex justify-center">
              <div className="relative">
                <div className="p-3 bg-white rounded-lg">
                  <QRCode value={ticket.qrCode} size={150} />
                </div>
                {roleConfig && (
                  <div
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                    style={{ backgroundColor: roleConfig.color }}
                  >
                    {roleConfig.label}
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Info */}
            <div className="px-4 pb-2 space-y-1">
              <p className="text-sm font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                {ticket.attendeeName}
              </p>
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {ticket.attendeeEmail}
              </p>
              {ticket.attendeePhone && (
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  {ticket.attendeePhone}
                </p>
              )}
              <div className="flex justify-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                  {ticket.ticketTier}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium text-primary-green-500">
                  {formatCurrency(ticket.price)}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div
                className="mt-2 p-4 border-t space-y-3"
                style={{ borderColor: 'var(--border-color)' }}
              >
                {/* Delivery Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Delivery:</span>
                  <div className="flex items-center gap-2">
                    {getDeliveryIcon(ticket.deliveryStatus)}
                    <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                      {ticket.deliveryStatus}
                    </span>
                    {ticket.sentAt && (
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(ticket.sentAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Check-in Info */}
                {ticket.checkedInAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Checked in:</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(ticket.checkedInAt).toLocaleString()}
                      {ticket.checkedInBy && ` by ${ticket.checkedInBy}`}
                    </span>
                  </div>
                )}

                {/* Role-specific benefits */}
                {roleConfig?.specialAccess && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Special Access:</span>
                    <span className="text-xs font-medium text-purple-500">{roleConfig.specialAccess}</span>
                  </div>
                )}
                {roleConfig?.discount && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Discount:</span>
                    <span className="text-xs font-medium text-green-500">{roleConfig.discount}% off</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleRegenerate(ticket.id)}
                    disabled={regenerating === ticket.id}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {regenerating === ticket.id ? (
                      <div className="w-3 h-3 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RefreshCw size={12} />
                    )}
                    Regenerate
                  </button>
                  <button
                    onClick={() => handleResend(ticket.id, 'email')}
                    disabled={resending?.id === ticket.id && resending?.method === 'email'}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {resending?.id === ticket.id && resending?.method === 'email' ? (
                      <div className="w-3 h-3 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Mail size={12} />
                    )}
                    Email
                  </button>
                  <button
                    onClick={() => handleResend(ticket.id, 'sms')}
                    disabled={resending?.id === ticket.id && resending?.method === 'sms'}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {resending?.id === ticket.id && resending?.method === 'sms' ? (
                      <div className="w-3 h-3 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Smartphone size={12} />
                    )}
                    SMS
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};