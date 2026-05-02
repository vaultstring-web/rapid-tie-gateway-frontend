'use client';

import { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ReadyRequest, PAYMENT_PROVIDERS } from '@/types/finance/readyRequests';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface ReadyRequestCardProps {
  request: ReadyRequest;
  onSelect: (id: string, selected: boolean) => void;
  onValidate: (id: string) => void;
}

export const ReadyRequestCard = ({ request, onSelect, onValidate }: ReadyRequestCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const provider = request.recipientDetails.provider ? PAYMENT_PROVIDERS[request.recipientDetails.provider] : null;

  const getStatusBadge = () => {
    if (!request.recipientDetails.isValid) {
      return {
        icon: <XCircle size={14} className="text-red-500" />,
        text: 'Invalid',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
      };
    }
    if (request.status === 'validated') {
      return {
        icon: <CheckCircle size={14} className="text-green-500" />,
        text: 'Validated',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
      };
    }
    return {
      icon: <AlertCircle size={14} className="text-yellow-500" />,
      text: 'Pending Validation',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className={`rounded-xl border transition-all hover:shadow-md ${
        request.selected ? 'ring-2 ring-[#84cc16]' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="mt-1">
            <input
              type="checkbox"
              checked={request.selected}
              onChange={(e) => onSelect(request.id, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {request.employeeName}
                  </h3>
                  <span className="text-sm text-[var(--text-secondary)]">{request.requestNumber}</span>
                  {request.hasEventAttendance && request.eventDetails && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      🎫 {request.eventDetails.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {request.department} • {request.destination}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#84cc16]">{formatCurrency(request.totalAmount)}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {statusBadge.icon}
                  <span className={`text-xs font-medium ${statusBadge.color}`}>{statusBadge.text}</span>
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar size={14} />
                <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <DollarSign size={14} />
                <span>{request.duration} days • {formatCurrency(request.perDiemRate)}/day</span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="mt-3 p-3 rounded-lg bg-[var(--bg-primary)]">
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Recipient Details</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-secondary)]">Name:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{request.recipientDetails.name}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Phone:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{request.recipientDetails.phone}</span>
                </div>
                {request.recipientDetails.accountNumber && (
                  <div>
                    <span className="text-[var(--text-secondary)]">Account:</span>
                    <span className="ml-2 text-[var(--text-primary)]">{request.recipientDetails.accountNumber}</span>
                  </div>
                )}
                {provider && (
                  <div>
                    <span className="text-[var(--text-secondary)]">Provider:</span>
                    <span className="ml-2" style={{ color: provider.color }}>{provider.label}</span>
                  </div>
                )}
              </div>
              {!request.recipientDetails.isValid && request.recipientDetails.validationError && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {request.recipientDetails.validationError}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {!request.recipientDetails.isValid && (
                <button
                  onClick={() => onValidate(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors"
                >
                  <CheckCircle size={14} />
                  Validate Details
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
        <div className="border-t p-4 space-y-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Employee ID</p>
              <p className="text-[var(--text-primary)]">{request.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Approved By</p>
              <p className="text-[var(--text-primary)]">{request.approvedBy}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Approved At</p>
              <p className="text-[var(--text-primary)]">{formatDate(request.approvedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Purpose</p>
              <p className="text-[var(--text-primary)]">{request.purpose}</p>
            </div>
          </div>
          {request.eventDetails && (
            <div className="mt-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Event Details</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">{request.eventDetails.name}</p>
              <p className="text-xs text-purple-500 dark:text-purple-500">{formatDate(request.eventDetails.date)} • {request.eventDetails.location}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};