'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TeamMember } from '@/types/rejected.ts/dashboard';
import { useTheme } from '@/context/ThemeContext';

interface TeamSummaryTableProps {
  members: TeamMember[];
  loading?: boolean;
}

export function TeamSummaryTable({ members, loading }: TeamSummaryTableProps) {
  const { theme } = useTheme();
  const [sortField, setSortField] = useState<keyof TeamMember>('pendingCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof TeamMember) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const getSortIcon = (field: keyof TeamMember) => {
    if (sortField !== field) return <ChevronUp size={14} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: keyof TeamMember;
    children: React.ReactNode;
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      style={{ color: 'var(--text-secondary)' }}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(field)}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl p-4 animate-pulse bg-[var(--bg-secondary)] border border-[var(--border-color)]"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
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

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--text-secondary)]">No team members found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Team Member
            </th>
            <SortableHeader field="pendingCount">Pending</SortableHeader>
            <SortableHeader field="approvedCount">Approved</SortableHeader>
            <SortableHeader field="rejectedCount">Rejected</SortableHeader>
            <SortableHeader field="approvalRate">Approval Rate</SortableHeader>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {sortedMembers.map((member) => (
            <tr key={member.id} className="hover:bg-[var(--hover-bg)] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-[#84cc16] font-semibold">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{member.department}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  {member.pendingCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {member.approvedCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {member.rejectedCount}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#84cc16] rounded-full"
                      style={{ width: `${member.approvalRate}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      member.approvalRate >= 70
                        ? 'text-green-600 dark:text-green-400'
                        : member.approvalRate >= 50
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {member.approvalRate}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
