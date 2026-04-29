'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  Ticket,
} from 'lucide-react';
import { PendingRequest, URGENCY_CONFIG } from '@/types/approver/pending';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface PendingApprovalCardProps {
  request: PendingRequest;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export const PendingApprovalCard = ({
  request,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onViewDetails,
}: PendingApprovalCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const urgencyConfig = URGENCY_CONFIG[request.urgency];

  const getDaysUntilDeadline = () => {
    const deadline = new Date(request.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline();
  const isUrgent = daysUntilDeadline <= 2;
  const isOverdue = daysUntilDeadline < 0;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(request.id, !isSelected);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove(request.id);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReject(request.id);
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        expanded ? 'shadow-lg' : 'hover:shadow-md'
      } ${urgencyConfig.border}`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Main Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div onClick={handleCheckboxClick} className="mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
            />
          </div>

          {/* Avatar/Icon */}
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
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyConfig.bg} ${urgencyConfig.color}`}
                  >
                    {urgencyConfig.label} Urgency
                  </span>
                  {request.hasEventAttendance && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Ticket size={10} />
                      Event Attendance
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {request.department} • {request.requestNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#84cc16]">{formatCurrency(request.amount)}</p>
                <p className="text-xs text-[var(--text-secondary)]">Total Amount</p>
              </div>
            </div>

            {/* Trip Details */}
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
                <Clock size={14} />
                <span>
                  {request.duration} days • Pending for {request.daysPending} days
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Briefcase size={14} />
                <span>{request.purpose}</span>
              </div>
            </div>

            {/* Deadline Warning */}
            {isOverdue ? (
              <div className="mt-3 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  OVERDUE! Deadline was {formatDate(request.deadline)}
                </span>
              </div>
            ) : isUrgent && daysUntilDeadline <= 2 ? (
              <div className="mt-3 p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-500" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  Approve by {formatDate(request.deadline)} ({daysUntilDeadline} days remaining)
                </span>
              </div>
            ) : null}

            {/* Event Attendance Badge Details */}
            {request.hasEventAttendance && request.eventDetails && !expanded && (
              <div className="mt-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                <Ticket size={12} />
                <span>
                  Attending: {request.eventDetails.name} on {formatDate(request.eventDetails.date)}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <XCircle size={16} />
                Reject
              </button>
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
          {/* Travel Authorization */}
          {request.travelAuthorizationRef && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Travel Authorization
              </h4>
              <p className="text-sm text-[var(--text-secondary)]">
                Reference: {request.travelAuthorizationRef}
              </p>
            </div>
          )}

          {/* Rate Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              Rate Breakdown
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Per Diem Rate:</span>
                <span className="text-[var(--text-primary)]">
                  {formatCurrency(request.perDiemRate)}/day
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Duration:</span>
                <span className="text-[var(--text-primary)]">{request.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Subtotal:</span>
                <span className="text-[var(--text-primary)]">
                  {formatCurrency(request.perDiemRate * request.duration)}
                </span>
              </div>
              {request.accommodationRate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Accommodation:</span>
                    <span className="text-[var(--text-primary)]">
                      {formatCurrency(request.accommodationRate)}/night
                    </span>
                  </div>
                  <div
                    className="flex justify-between pt-1 border-t"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span className="font-semibold text-[var(--text-primary)]">Total:</span>
                    <span className="font-bold text-[#84cc16]">
                      {formatCurrency(request.amount)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Event Details (if applicable) */}
          {request.hasEventAttendance && request.eventDetails && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <Ticket size={14} className="text-purple-500" />
                Event Details
              </h4>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 space-y-1">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {request.eventDetails.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                  <CalendarDays size={12} />
                  <span>{formatDate(request.eventDetails.date)}</span>
                  <MapPin size={12} />
                  <span>{request.eventDetails.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          {request.comments && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Employee Comments
              </h4>
              <p className="text-sm text-[var(--text-secondary)] italic">"{request.comments}"</p>
            </div>
          )}

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Attachments</h4>
              <div className="flex gap-2">
                {request.attachments.map((attachment, idx) => (
                  <button key={idx} className="text-sm text-[#84cc16] hover:underline">
                    📎 {attachment}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* View Full Details Button */}
          <button
            onClick={() => onViewDetails(request.id)}
            className="w-full mt-2 py-2 rounded-lg border border-[#84cc16] text-[#84cc16] text-sm font-medium hover:bg-[#84cc16] hover:text-white transition-colors"
          >
            View Full Details
          </button>
        </div>
      )}
    </div>
  );
};