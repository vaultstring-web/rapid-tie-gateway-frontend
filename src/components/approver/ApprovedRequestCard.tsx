'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Building2,
  CheckCircle,
  Clock,
  TrendingUp,
  Ticket,
} from 'lucide-react';
import {
  ApprovedRequest,
  PAYMENT_STATUS_CONFIG,
  URGENCY_CONFIG,
} from '@/types/approver/approved';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

// Rest of the file remains the same...

interface ApprovedRequestCardProps {
  request: ApprovedRequest;
  onViewDetails: (id: string) => void;
  onViewPayment?: (id: string) => void;
}

export const ApprovedRequestCard = ({
  request,
  onViewDetails,
  onViewPayment,
}: ApprovedRequestCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const paymentConfig =
    PAYMENT_STATUS_CONFIG[request.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG];
  const urgencyConfig = URGENCY_CONFIG[request.urgency];

  return (
    <div
      className="rounded-xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {request.employeeAvatar ? (
              <img
                src={request.employeeAvatar}
                alt={request.employeeName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                <User size={18} className="text-[#84cc16]" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {request.employeeName}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyConfig?.bg} ${urgencyConfig?.color}`}
                  >
                    {urgencyConfig?.label}
                  </span>
                  {request.hasEventAttendance && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Ticket size={10} />
                      Event
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {request.department} • {request.requestNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#84cc16]">
                  {formatCurrency(request.approvedAmount)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span>{paymentConfig.icon}</span>
                  <span className={`text-xs font-medium ${paymentConfig.color}`}>
                    {paymentConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <MapPin size={14} />
                <span>{request.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar size={14} />
                <span>
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Building2 size={14} />
                <span>{request.department}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <TrendingUp size={14} />
                <span>{request.duration} days</span>
              </div>
            </div>

            {/* Approval Info */}
            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <CheckCircle size={12} className="text-green-500" />
              <span>
                Approved by {request.approvedBy} • {formatDateTime(request.approvedAt)}
              </span>
            </div>

            {/* Event Name (if applicable) */}
            {request.hasEventAttendance && request.eventName && !expanded && (
              <div className="mt-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                <Ticket size={12} />
                <span>{request.eventName}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onViewDetails(request.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                View Details
              </button>
              {request.paymentStatus === 'paid' && onViewPayment && (
                <button
                  onClick={() => onViewPayment(request.id)}
                  className="px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  📄 Receipt
                </button>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t p-4 space-y-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Request Amount</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {formatCurrency(request.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Approved Amount</p>
              <p className="text-sm font-medium text-[#84cc16]">
                {formatCurrency(request.approvedAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Purpose</p>
              <p className="text-sm text-[var(--text-primary)]">{request.purpose}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Approver Role</p>
              <p className="text-sm text-[var(--text-primary)]">{request.approverRole}</p>
            </div>
            {request.paymentReference && (
              <div className="col-span-2">
                <p className="text-xs text-[var(--text-secondary)]">Payment Reference</p>
                <p className="text-sm font-mono text-[var(--text-primary)]">
                  {request.paymentReference}
                </p>
              </div>
            )}
            {request.notes && (
              <div className="col-span-2">
                <p className="text-xs text-[var(--text-secondary)]">Notes</p>
                <p className="text-sm text-[var(--text-secondary)] italic">"{request.notes}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
