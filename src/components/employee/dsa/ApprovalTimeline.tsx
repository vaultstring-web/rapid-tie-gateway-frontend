'use client';

import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { ApprovalStep } from '@/types/employee/dsaDetails';
import { formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface ApprovalTimelineProps {
  approvals: ApprovalStep[];
  loading?: boolean;
}

export const ApprovalTimeline = ({ approvals, loading }: ApprovalTimelineProps) => {
  const { theme } = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'border-green-500';
      case 'rejected':
        return 'border-red-500';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (approvals.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={32} className="mx-auto mb-3 opacity-50 text-[var(--text-secondary)]" />
        <p className="text-sm text-[var(--text-secondary)]">No approval steps configured</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />
      
      <div className="space-y-6">
        {approvals.map((approval, index) => (
          <div key={approval.id} className="relative flex gap-3">
            {/* Timeline dot */}
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-full bg-[var(--bg-secondary)] border-2 ${getStatusColor(approval.status)} flex items-center justify-center`}>
                {approval.approverAvatar ? (
                  <img src={approval.approverAvatar} alt={approval.approverName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <User size={18} className="text-[var(--text-secondary)]" />
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {approval.approverName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{approval.approverRole}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(approval.status)}
                  <span className={`text-xs font-medium capitalize ${
                    approval.status === 'approved' ? 'text-green-500' :
                    approval.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {approval.status}
                  </span>
                </div>
              </div>
              
              {approval.comments && (
                <p className="text-sm text-[var(--text-secondary)] mt-2 p-2 rounded-lg bg-[var(--bg-primary)]">
                  "{approval.comments}"
                </p>
              )}
              
              {approval.approvedAt && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {formatDateTime(approval.approvedAt)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};