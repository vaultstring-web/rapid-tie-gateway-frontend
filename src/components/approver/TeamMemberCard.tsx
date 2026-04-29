'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react';
import { TeamMember } from '@/types/approver/team';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TeamMemberCardProps {
  member: TeamMember;
  onViewDetails: (id: string) => void;
  onViewDecisions: (id: string) => void;
}

export const TeamMemberCard = ({ member, onViewDetails, onViewDecisions }: TeamMemberCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const getStatusConfig = () => {
    switch (member.status) {
      case 'active':
        return { label: 'Active', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
      case 'inactive':
        return { label: 'Inactive', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' };
      case 'on_leave':
        return { label: 'On Leave', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
      default:
        return { label: 'Active', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    }
  };

  const statusConfig = getStatusConfig();

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
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                <User size={20} className="text-[#84cc16]" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {member.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {member.role} • {member.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#84cc16]">
                  {member.metrics.approvalRate}%
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Approval Rate</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-3 mt-2 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Joined {formatDate(member.joinDate)}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="text-lg font-bold text-[var(--text-primary)]">{member.metrics.totalApproved}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Approved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <XCircle size={12} className="text-red-500" />
                  <span className="text-lg font-bold text-[var(--text-primary)]">{member.metrics.totalRejected}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Rejected</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock size={12} className="text-yellow-500" />
                  <span className="text-lg font-bold text-[var(--text-primary)]">{member.metrics.totalPending}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Pending</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onViewDetails(member.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                View Profile
              </button>
              <button
                onClick={() => onViewDecisions(member.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <Eye size={14} />
                Decisions
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
          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Total Amount Approved</p>
              <p className="text-sm font-semibold text-[#84cc16]">{formatCurrency(member.metrics.totalAmountApproved)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Avg Response Time</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{member.metrics.averageResponseTime} hours</p>
            </div>
          </div>

          {/* Recent Decisions */}
          {member.recentDecisions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-[#84cc16]" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Recent Decisions</h4>
              </div>
              <div className="space-y-2">
                {member.recentDecisions.slice(0, 3).map((decision) => (
                  <div key={decision.id} className="flex justify-between items-center p-2 rounded-lg bg-[var(--hover-bg)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {decision.requestNumber} - {decision.employeeName}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">{formatDate(decision.decidedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#84cc16]">{formatCurrency(decision.amount)}</p>
                      <span className={`text-xs ${decision.decision === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                        {decision.decision === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};