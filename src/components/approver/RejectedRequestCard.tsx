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
  XCircle,
  AlertCircle,
  RefreshCw,
  Ticket,
  Clock
} from 'lucide-react';
import { RejectedRequest, REJECTION_CATEGORIES, URGENCY_CONFIG } from '@/types/approver/rejected';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface RejectedRequestCardProps {
  request: RejectedRequest;
  onViewDetails: (id: string) => void;
  onResubmit?: (id: string) => void;
}

export const RejectedRequestCard = ({ request, onViewDetails, onResubmit }: RejectedRequestCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const categoryConfig = REJECTION_CATEGORIES[request.rejectionCategory];
  const urgencyConfig = URGENCY_CONFIG[request.urgency];
  const isResubmitAvailable = request.canResubmit && (!request.resubmitDeadline || new Date(request.resubmitDeadline) > new Date());

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
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <User size={18} className="text-red-500" />
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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyConfig?.bg} ${urgencyConfig?.color}`}>
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
                <p className="text-xl font-bold text-red-500 line-through">{formatCurrency(request.amount)}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <XCircle size={14} className="text-red-500" />
                  <span className="text-xs font-medium text-red-500">Rejected</span>
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
                <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Building2 size={14} />
                <span>{request.department}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Clock size={14} />
                <span>{request.duration} days</span>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="mt-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-xs font-medium text-red-700 dark:text-red-300">Rejection Reason</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{request.rejectionReason}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${categoryConfig.bg} ${categoryConfig.color}`}>
                  {categoryConfig.label}
                </span>
                <span className="text-xs text-red-600 dark:text-red-400">
                  Rejected by {request.rejectedBy} • {formatDateTime(request.rejectedAt)}
                </span>
              </div>
            </div>

            {/* Resubmit Available Badge */}
            {isResubmitAvailable && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <RefreshCw size={12} />
                <span>Can be resubmitted</span>
                {request.resubmitDeadline && (
                  <span>• Deadline: {formatDate(request.resubmitDeadline)}</span>
                )}
              </div>
            )}

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
              {isResubmitAvailable && onResubmit && (
                <button
                  onClick={() => onResubmit(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#84cc16] text-white text-sm font-medium hover:brightness-110 transition-colors"
                >
                  <RefreshCw size={14} />
                  Resubmit
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
              <p className="text-xs text-[var(--text-secondary)]">Employee ID</p>
              <p className="text-sm text-[var(--text-primary)]">{request.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Purpose</p>
              <p className="text-sm text-[var(--text-primary)]">{request.purpose}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Approver Role</p>
              <p className="text-sm text-[var(--text-primary)]">{request.approverRole}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Resubmit Deadline</p>
              <p className="text-sm text-[var(--text-primary)]">
                {request.resubmitDeadline ? formatDate(request.resubmitDeadline) : 'N/A'}
              </p>
            </div>
            {request.notes && (
              <div className="col-span-2">
                <p className="text-xs text-[var(--text-secondary)]">Additional Notes</p>
                <p className="text-sm text-[var(--text-secondary)] italic">"{request.notes}"</p>
              </div>
            )}
          </div>

          {/* Recommendation for Resubmission */}
          {isResubmitAvailable && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">💡 Recommendation</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                To resubmit, please address the rejection reason above and provide any missing documentation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};