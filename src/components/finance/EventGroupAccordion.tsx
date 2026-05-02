'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Users, DollarSign } from 'lucide-react';
import { EventGroup } from '@/types/finance/readyRequests';
import { ReadyRequestCard } from './ReadyRequestCard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface EventGroupAccordionProps {
  group: EventGroup;
  selectedIds: Set<string>;
  onSelectRequest: (id: string, selected: boolean) => void;
  onSelectAllInGroup: (eventId: string, selected: boolean) => void;
  onValidateRequest: (id: string) => void;
}

export const EventGroupAccordion = ({
  group,
  selectedIds,
  onSelectRequest,
  onSelectAllInGroup,
  onValidateRequest,
}: EventGroupAccordionProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  
  const allSelectedInGroup = group.requests.every(r => selectedIds.has(r.id));
  const someSelectedInGroup = group.requests.some(r => selectedIds.has(r.id));

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover-bg)] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelectedInGroup}
              ref={(el) => {
                if (el) el.indeterminate = someSelectedInGroup && !allSelectedInGroup;
              }}
              onChange={(e) => {
                e.stopPropagation();
                onSelectAllInGroup(group.eventId, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
            />
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Calendar size={18} className="text-purple-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-[var(--text-primary)]">{group.eventName}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{group.eventDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{group.requestCount} requests</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} />
              <span>{formatCurrency(group.totalAmount)}</span>
            </div>
          </div>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-t p-4 space-y-4" style={{ borderColor: 'var(--border-color)' }}>
          {group.requests.map((request) => (
            <ReadyRequestCard
              key={request.id}
              request={request}
              onSelect={onSelectRequest}
              onValidate={onValidateRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};